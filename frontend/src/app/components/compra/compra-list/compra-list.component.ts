import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../services/compra.service';
import { Compra } from '../../../models/compra.model';
import { CompraFormComponent } from '../compra-form/compra-form.component';
import { CompraBoletaComponent } from '../compra-boleta/compra-boleta.component';

@Component({
    selector: 'app-compra-list',
    standalone: true,
    imports: [CommonModule, CompraFormComponent, CompraBoletaComponent],
    templateUrl: './compra-list.component.html',
    styleUrl: './compra-list.component.css'
})
export class CompraListComponent implements OnInit {
    @ViewChild(CompraFormComponent) compraModal!: CompraFormComponent;

    private service = inject(CompraService);
    compras: Compra[] = [];
    loading: boolean = false;
    error: string = '';

    showModal: boolean = false;
    showBoletaModal: boolean = false;
    selectedId: number | null = null;

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.service.getAll().subscribe({
            next: (response) => {
                this.compras = Array.isArray(response.data) ? response.data : [];
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar compras';
                this.loading = false;
            }
        });
    }

    abrirModalNuevo() {
        this.selectedId = null;
        this.showModal = true;
    }

    verCompra(id: number) {
        this.selectedId = id;
        this.showBoletaModal = true;
    }

    onModalClose(saved: boolean) {
        this.showModal = false;
        this.selectedId = null;
        if (saved) {
            this.loadData();
        }
    }

    onBoletaClose() {
        this.showBoletaModal = false;
        this.selectedId = null;
    }
}
