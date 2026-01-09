import { Component, OnInit, inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormsModule } from '@angular/forms';
import { VentaService } from '../../../services/venta.service';
import { Venta, VentaDetalle } from '../../../models/venta.model';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { ServicioService } from '../../../services/servicio.service';
import { Servicio } from '../../../models/servicio.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-venta-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './venta-form.component.html',
    styleUrl: './venta-form.component.css'
})
export class VentaFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private ventaService = inject(VentaService);
    private clienteService = inject(ClienteService);
    private productoService = inject(ProductoService);
    private servicioService = inject(ServicioService);
    private authService = inject(AuthService);

    @Input() idVenta: number | null = null; // En caso de que se implemente edición futura
    @Output() close = new EventEmitter<boolean>();

    headerForm: FormGroup = this.fb.group({
        id_cliente: [null as number | null, Validators.required],
        tipo_pago: ['EFECTIVO', Validators.required]
    });

    clientes: Cliente[] = [];
    productos: Producto[] = [];
    servicios: Servicio[] = [];
    detalles: VentaDetalle[] = [];
    loading: boolean = false;
    tipoItem: 'PRODUCTO' | 'SERVICIO' = 'PRODUCTO';
    
    selectedProductoId: number | null = null;
    selectedServicioId: number | null = null;
    cantidad: number = 1;

    isViewMode: boolean = false;

    error: string = '';

    get total() {
        return this.detalles.reduce((sum, item) => sum + item.subtotal, 0);
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idVenta'] && this.idVenta) {
            this.loadVenta(this.idVenta);
        } else if (changes['idVenta'] && !this.idVenta) {
            this.resetForm();
        }
    }

    loadVenta(id: number) {
        this.loading = true;
        this.isViewMode = true;
        this.ventaService.getById(id).subscribe({
            next: (resp) => {
                if (resp.success && resp.data && !Array.isArray(resp.data)) {
                    const venta = resp.data as Venta;
                    this.headerForm.patchValue({
                        id_cliente: venta.id_cliente,
                        tipo_pago: venta.tipo_pago
                    });
                    this.headerForm.disable(); // Read-only

                    if (venta.detalles) {
                        this.detalles = venta.detalles.map(d => ({
                            ...d,
                            nombreItem: d.nombre_producto || d.nombre_servicio || 'Item desconocido',
                            tipo: d.id_producto ? 'PRODUCTO' : 'SERVICIO'
                        }));
                    }
                }
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar la venta';
                this.loading = false;
            }
        });
    }

    resetForm() {
        this.isViewMode = false;
        this.headerForm.reset({ tipo_pago: 'EFECTIVO' });
        this.headerForm.enable();
        this.detalles = [];
        this.selectedProductoId = null;
        this.selectedServicioId = null;
        this.cantidad = 1;
    }

    loadData() {
        this.loading = true;
        this.clienteService.getAll().subscribe(response => {
            this.clientes = Array.isArray(response.data) ? response.data : [];
            this.checkLoading();
        });
        this.productoService.getAll().subscribe(response => {
            this.productos = Array.isArray(response.data) ? response.data : [];
            this.checkLoading();
        });
        this.servicioService.getAll().subscribe(response => {
            this.servicios = Array.isArray(response.data) ? response.data : [];
            this.checkLoading();
        });
    }

    checkLoading() {      
        this.loading = false;
    }

    onProductSelect(id: string) {
      
    }

    addItem() {
        const itemId = this.tipoItem === 'PRODUCTO' ? this.selectedProductoId : this.selectedServicioId;
        const qty = this.cantidad;

        if (!itemId || qty <= 0) return;

        if (this.tipoItem === 'PRODUCTO') {
            const producto = this.productos.find(p => p.id_producto == itemId);
            if (!producto) return;

            if (producto.stock < qty) {
                alert('Stock insuficiente');
                return;
            }

           
            const existingItem = this.detalles.find(d => d.id_producto === itemId);
            if (existingItem) {
                existingItem.cantidad += qty;
                existingItem.subtotal = existingItem.cantidad * existingItem.precio;
            } else {
                const subtotal = producto.precio_venta * qty;
                this.detalles.push({
                    id_producto: producto.id_producto,
                    cantidad: qty,
                    precio: producto.precio_venta,
                    subtotal: subtotal,
                    nombreItem: producto.nombre,
                    tipo: 'PRODUCTO'
                });
            }
        } else {
            // SERVICIO
            const servicio = this.servicios.find(s => s.id_servicio == itemId);
            if (!servicio) return;

            const existingItem = this.detalles.find(d => d.id_servicio === itemId);
            if (existingItem) {
                existingItem.cantidad += qty;
                existingItem.subtotal = existingItem.cantidad * existingItem.precio;
            } else {
                const subtotal = servicio.precio * qty;
                this.detalles.push({
                    id_servicio: servicio.id_servicio,
                    cantidad: qty,
                    precio: servicio.precio,
                    subtotal: subtotal,
                    nombreItem: servicio.nombre,
                    tipo: 'SERVICIO'
                });
            }
        }
      
        this.selectedProductoId = null;
        this.selectedServicioId = null;
        this.cantidad = 1;
    }

    removeItem(index: number) {
        this.detalles.splice(index, 1);
    }

    onCancel() {
        this.close.emit(false);
    }

    guardarVenta() {
        if (this.headerForm.invalid || this.detalles.length === 0) return;

        const user = this.authService.getUser();
        if (!user) {
            alert('Usuario no autenticado');
            return;
        }

        this.loading = true;
        const { id_cliente, tipo_pago } = this.headerForm.value;

        const ventaData: Venta = {
            id_cliente: id_cliente!,
            idusuario: user.idusuario || user.id || 0,
            id_usuario: user.id || user.idusuario,
            tipo_pago: tipo_pago!,
            total: this.total,
            monto_pagado: this.total,
            detalles: this.detalles
        };

        this.ventaService.create(ventaData).subscribe({
            next: (res) => {
                alert('Venta registrada con éxito');
                this.loading = false;
                this.close.emit(true);
            },
            error: (err) => {
                console.error(err);
                alert('Error al registrar venta');
                this.loading = false;
            }
        });
    }
}
