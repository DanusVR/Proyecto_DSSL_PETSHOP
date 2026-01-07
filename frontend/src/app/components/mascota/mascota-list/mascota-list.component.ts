import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../services/mascota.service';
import { Mascota } from '../../../models/mascota.model';
import { MascotaFormComponent } from '../mascota-form/mascota-form.component';
import { HistorialService } from '../../../services/historial.service';

@Component({
    selector: 'app-mascota-list',
    standalone: true,
    imports: [CommonModule, MascotaFormComponent],
    templateUrl: './mascota-list.component.html',
    styleUrls: ['./mascota-list.component.css']
})
export class MascotaListComponent implements OnInit {
    @ViewChild(MascotaFormComponent) mascotaModal!: MascotaFormComponent;

    private service = inject(MascotaService);

    mascotas: Mascota[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarMascotas();
    }

    cargarMascotas(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.mascotas = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar las mascotas';
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
            this.cargarMascotas();
        }
    }

    // Historial Modal
    showHistorialModal: boolean = false;
    selectedMascotaId: number | null = null;
    selectedMascotaNombre: string = '';
    historialRecords: any[] = [];
    historialLoading: boolean = false;

    private historialService = inject(HistorialService);

    verHistorial(id: number, nombre: string) {
        this.selectedMascotaId = id;
        this.selectedMascotaNombre = nombre;
        this.showHistorialModal = true;
        this.cargarHistorialMascota(id);
    }

    cargarHistorialMascota(id: number) {
        this.historialLoading = true;
        this.historialService.obtenerHistorialPorMascota(id).subscribe({
            next: (resp) => {
                if (resp && resp.data && Array.isArray(resp.data)) {
                    this.historialRecords = resp.data;
                } else {
                    this.historialRecords = [];
                }
                this.historialLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.historialLoading = false;
            }
        });
    }

    closeHistorialModal() {
        this.showHistorialModal = false;
        this.selectedMascotaId = null;
        this.historialRecords = [];
    }

    eliminarMascota(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta mascota?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarMascotas();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar la mascota';
                    console.error(err);
                }
            });
        }
    }
}
