import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../models/proveedor.model';
import { ProveedorFormComponent } from '../proveedor-form/proveedor-form.component';

@Component({
    selector: 'app-proveedor-list',
    standalone: true,
    imports: [CommonModule, ProveedorFormComponent],
    templateUrl: './proveedor-list.component.html',
    styleUrls: ['./proveedor-list.component.css']
})
export class ProveedorListComponent implements OnInit {
    @ViewChild(ProveedorFormComponent) proveedorModal!: ProveedorFormComponent;

    private service = inject(ProveedorService);

    proveedores: Proveedor[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarProveedores();
    }

    cargarProveedores(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.proveedores = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar los proveedores';
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
            this.cargarProveedores();
        }
    }

    eliminarProveedor(id: number): void {
        if (confirm('¿Estás seguro de eliminar este proveedor?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarProveedores();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar el proveedor';
                    console.error(err);
                }
            });
        }
    }
}
