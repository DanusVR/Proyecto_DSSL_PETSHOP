import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../models/venta.model';
import { VentaFormComponent } from '../venta-form/venta-form.component';
import { VentaBoletaComponent } from '../venta-boleta/venta-boleta.component';

@Component({
    selector: 'app-venta-list',
    standalone: true,
    imports: [CommonModule, VentaFormComponent, VentaBoletaComponent],
    templateUrl: './venta-list.component.html',
    styleUrl: './venta-list.component.css'
})
export class VentaListComponent implements OnInit {
    @ViewChild(VentaFormComponent) ventaModal!: VentaFormComponent;

    private service = inject(VentaService);
    ventas: Venta[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    showBoletaModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit() {
        this.cargarVentas();
    }

    cargarVentas() {
        this.loading = true;
        this.service.getAll().subscribe({
            next: (response) => {
                this.ventas = Array.isArray(response.data) ? response.data : [];
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar ventas';
                this.loading = false;
            }
        });
    }

    abrirModalNuevo() {
        this.selectedId = null;
        this.showModal = true;
    }

    verVenta(id: number) {
        this.selectedId = id;
        this.showBoletaModal = true;
    }

    onModalClose(saved: boolean) {
        this.showModal = false;
        this.selectedId = null;
        if (saved) {
            this.cargarVentas();
        }
    }

    onBoletaClose() {
        this.showBoletaModal = false;
        this.selectedId = null;
    }
}
