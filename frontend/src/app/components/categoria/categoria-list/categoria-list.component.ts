import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';

@Component({
    selector: 'app-categoria-list',
    standalone: true,
    imports: [CommonModule, CategoriaFormComponent],
    templateUrl: './categoria-list.component.html',
    styleUrls: ['./categoria-list.component.css']
})
export class CategoriaListComponent implements OnInit {
    @ViewChild(CategoriaFormComponent) categoriaModal!: CategoriaFormComponent;

    private service = inject(CategoriaService);

    categorias: Categoria[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarCategorias();
    }

    cargarCategorias(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.categorias = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar las categorías';
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
            this.cargarCategorias();
        }
    }

    eliminarCategoria(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarCategorias();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar la categoría';
                    console.error(err);
                }
            });
        }
    }
}
