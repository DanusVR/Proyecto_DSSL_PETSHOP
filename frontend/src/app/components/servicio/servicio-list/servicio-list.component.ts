import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../../services/servicio.service';
import { Servicio } from '../../../models/servicio.model';
import { ServicioFormComponent } from '../servicio-form/servicio-form.component';

@Component({
    selector: 'app-servicio-list',
    standalone: true,
    imports: [CommonModule, ServicioFormComponent],
    templateUrl: './servicio-list.component.html',
    styleUrls: ['./servicio-list.component.css']
})
export class ServicioListComponent implements OnInit {
    @ViewChild(ServicioFormComponent) servicioModal!: ServicioFormComponent;

    private service = inject(ServicioService);

    servicios: Servicio[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarServicios();
    }

    cargarServicios(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.servicios = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar los servicios';
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
            this.cargarServicios();
        }
    }

    eliminarServicio(id: number): void {
        if (confirm('¿Estás seguro de eliminar este servicio?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarServicios();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar el servicio';
                    console.error(err);
                }
            });
        }
    }
}
