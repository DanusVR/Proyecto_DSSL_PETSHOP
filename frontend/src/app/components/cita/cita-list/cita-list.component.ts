import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../services/cita.service';
import { Cita } from '../../../models/cita.model';
import { CitaFormComponent } from '../cita-form/cita-form.component';

@Component({
    selector: 'app-cita-list',
    standalone: true,
    imports: [CommonModule, CitaFormComponent],
    templateUrl: './cita-list.component.html',
    styleUrls: ['./cita-list.component.css']
})
export class CitaListComponent implements OnInit {
    @ViewChild(CitaFormComponent) citaModal!: CitaFormComponent;

    private service = inject(CitaService);

    citas: Cita[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarCitas();
    }

    cargarCitas(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.citas = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar las citas';
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
            this.cargarCitas();
        }
    }

    eliminarCita(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta cita?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarCitas();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar la cita';
                    console.error(err);
                }
            });
        }
    }

    getEstadoBadgeClass(estado: string | undefined): string {
        if (!estado) return 'bg-secondary';
        const status = estado.toLowerCase();
        switch (status) {
            case 'pendiente':
                return 'bg-warning text-dark';
            case 'atendido':
                return 'bg-success';
            case 'cancelado':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }
}
