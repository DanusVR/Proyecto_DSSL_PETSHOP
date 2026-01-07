import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService } from '../../../services/historial.service';
import { Historial } from '../../../models/historial.model';
import { HistorialFormComponent } from '../historial-form/historial-form.component';

@Component({
    selector: 'app-historial-list',
    standalone: true,
    imports: [CommonModule, HistorialFormComponent],
    templateUrl: './historial-list.component.html',
    styleUrls: ['./historial-list.component.css']
})
export class HistorialListComponent implements OnInit {
    @ViewChild(HistorialFormComponent) historialModal!: HistorialFormComponent;

    private service = inject(HistorialService);

    historial: Historial[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit(): void {
        this.cargarHistorial();
    }

    cargarHistorial(): void {
        this.loading = true;
        this.error = '';

        this.service.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.historial = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar el historial';
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
            this.cargarHistorial();
        }
    }

    eliminarHistorial(id: number): void {
        if (confirm('¿Estás seguro de eliminar este registro del historial?')) {
            this.service.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarHistorial();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar el registro';
                    console.error(err);
                }
            });
        }
    }
}
