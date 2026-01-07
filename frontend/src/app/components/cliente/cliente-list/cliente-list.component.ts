import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';

@Component({
    selector: 'app-cliente-list',
    standalone: true,
    imports: [CommonModule, ClienteFormComponent],
    templateUrl: './cliente-list.component.html',
    styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
    @ViewChild(ClienteFormComponent) clienteModal!: ClienteFormComponent;

    clientes: Cliente[] = [];
    loading: boolean = false;
    error: string = '';
    showModal: boolean = false;
    selectedId: number | null = null;

    constructor(private clienteService: ClienteService) { }

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes(): void {
        this.loading = true;
        this.error = '';

        this.clienteService.getAll().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data)) {
                    this.clientes = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar los clientes';
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
            this.cargarClientes();
        }
    }

    eliminarCliente(id: number): void {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            this.clienteService.delete(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.cargarClientes();
                    }
                },
                error: (err) => {
                    this.error = 'Error al eliminar el cliente';
                    console.error(err);
                }
            });
        }
    }
}
