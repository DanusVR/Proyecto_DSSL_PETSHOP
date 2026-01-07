import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
    selector: 'app-producto-list',
    standalone: true,
    imports: [CommonModule, ProductoFormComponent],
    templateUrl: './producto-list.component.html',
    styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
    @ViewChild(ProductoFormComponent) productoModal!: ProductoFormComponent;

    productos: Producto[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    constructor(private productoService: ProductoService) { }

    ngOnInit(): void {
        this.cargarProductos();
    }

    cargarProductos(): void {
        this.loading = true;
        this.error = '';

        this.productoService.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.productos = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar los productos';
                console.error(err);
                this.loading = false;
            }
        });
    }

    abrirModalNuevo(): void {
        this.selectedId = null;
        this.showModal = true;
    }

    abrirModalEditar(id: number): void {
        this.selectedId = id;
        this.showModal = true;
    }

    onModalClose(saved: boolean): void {
        this.showModal = false;
        this.selectedId = null;
        if (saved) {
            this.cargarProductos();
        }
    }

    eliminarProducto(id: number): void {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.productoService.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarProductos();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar el producto';
                    console.error(err);
                }
            });
        }
    }
}
