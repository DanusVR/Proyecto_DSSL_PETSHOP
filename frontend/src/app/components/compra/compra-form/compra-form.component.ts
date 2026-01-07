import { Component, OnInit, inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CompraService } from '../../../services/compra.service';
import { Compra } from '../../../models/compra.model';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../models/proveedor.model';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-compra-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './compra-form.component.html',
    styleUrl: './compra-form.component.css'
})
export class CompraFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private compraService = inject(CompraService);
    private proveedorService = inject(ProveedorService);
    private productoService = inject(ProductoService);
    private authService = inject(AuthService);

    @Input() idCompra: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    headerForm: FormGroup = this.fb.group({
        id_proveedor: [null as number | null, Validators.required],
        tipo_comprobante: ['BOLETA', Validators.required]
    });

    proveedores: Proveedor[] = [];
    productos: Producto[] = [];
    detalles: any[] = []; // Update with interface if available
    loading: boolean = false;
    error: string = '';
    isViewMode: boolean = false;

    get total() {
        return this.detalles.reduce((sum, item) => sum + item.subtotal, 0);
    }

    ngOnInit() {
        this.loadInitialData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idCompra']) {
            if (this.idCompra) {
                this.isViewMode = true;
                this.loadCompra(this.idCompra);
                this.headerForm.disable(); // Read-only
            } else {
                this.isViewMode = false;
                this.resetForm();
            }
        }
    }

    resetForm() {
        this.headerForm.reset({
            tipo_comprobante: 'BOLETA'
        });
        this.headerForm.enable();
        this.detalles = [];
        this.error = '';
    }

    loadCompra(id: number) {
        this.loading = true;
        this.compraService.getById(id).subscribe({
            next: (resp) => {
                if (resp.success && resp.data && !Array.isArray(resp.data)) {
                    const compra = resp.data as Compra;
                    this.headerForm.patchValue({
                        id_proveedor: compra.id_proveedor,
                        tipo_comprobante: 'BOLETA'
                    });
                    // Map details
                    if (compra.detalles) {
                        this.detalles = compra.detalles.map(d => ({
                            id_producto: d.id_producto,
                            cantidad: d.cantidad,
                            precio_unitario: d.precio_unitario,
                            subtotal: d.cantidad * d.precio_unitario,
                            nombreProducto: d.nombre_producto
                        }));
                    }
                }
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar la compra';
                this.loading = false;
            }
        });
    }

    loadInitialData() {
        this.loading = true;
        this.proveedorService.getAll().subscribe(response => {
            this.proveedores = Array.isArray(response.data) ? response.data : [];
            this.checkLoading();
        });
        this.productoService.getAll().subscribe(response => {
            this.productos = Array.isArray(response.data) ? response.data : [];
            this.checkLoading();
        });
    }

    checkLoading() {
        this.loading = false;
    }

    addItem(prodIdStr: string, costStr: string, qtyStr: string) {
        const prodId = Number(prodIdStr);
        const cost = Number(costStr);
        const qty = Number(qtyStr);

        if (!prodId || qty <= 0 || cost < 0) return;

        const producto = this.productos.find(p => p.id_producto == prodId);
        if (!producto) return;

        const subtotal = cost * qty;

        this.detalles.push({
            id_producto: producto.id_producto,
            cantidad: qty,
            precio_unitario: cost,
            subtotal: subtotal,
            nombreProducto: producto.nombre
        });
    }

    removeItem(index: number) {
        this.detalles.splice(index, 1);
    }

    onCancel() {
        this.close.emit(false);
    }

    guardarCompra() {
        if (this.headerForm.invalid || this.detalles.length === 0) return;

        const user = this.authService.getUser();
        if (!user) {
            alert('Usuario no autenticado');
            return;
        }

        this.loading = true;
        const { id_proveedor, tipo_comprobante } = this.headerForm.value;

        const compraData = {
            id_proveedor: id_proveedor,
            id_usuario: user.id || 1, // Fallback
            tipo_comprobante: tipo_comprobante,
            total: this.total,
            fecha_compra: new Date(),
            detalles: this.detalles
        };

        this.compraService.create(compraData as any).subscribe({
            next: (res) => {
                alert('Compra registrada con éxito');
                this.loading = false;
                this.close.emit(true);
            },
            error: (err) => {
                console.error(err);
                alert('Error al registrar compra');
                this.loading = false;
            }
        });
    }
}
