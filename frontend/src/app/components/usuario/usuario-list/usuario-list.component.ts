import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';

@Component({
    selector: 'app-usuario-list',
    standalone: true,
    imports: [CommonModule, UsuarioFormComponent],
    templateUrl: './usuario-list.component.html',
    styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
    @ViewChild(UsuarioFormComponent) usuarioModal!: UsuarioFormComponent;

    private service = inject(UsuarioService);

    usuarios: Usuario[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    cargarUsuarios(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.usuarios = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar los usuarios';
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
            this.cargarUsuarios();
        }
    }

    eliminarUsuario(id: number): void {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarUsuarios();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar el usuario';
                    console.error(err);
                }
            });
        }
    }
}
