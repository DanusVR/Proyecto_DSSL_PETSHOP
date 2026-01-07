import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';

@Component({
    selector: 'app-cliente-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cliente-form.component.html',
    styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private clienteService = inject(ClienteService);

    @Input() idCliente: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    clienteForm: FormGroup;
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    constructor() {
        this.clienteForm = this.fb.group({
            nombreC: ['', [Validators.required, Validators.minLength(3)]],
            apellido: ['', [Validators.required, Validators.minLength(3)]],
            dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            telefono: ['', [Validators.required]],
            direccion: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idCliente']) {
            this.checkMode();
        }
    }

    checkMode() {
        if (this.idCliente) {
            this.isEditMode = true;
            this.loading = true;
            this.clienteService.getById(this.idCliente).subscribe({
                next: (response) => {
                    if (response.success && response.data && !Array.isArray(response.data)) {
                        this.clienteForm.patchValue(response.data);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar el cliente';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.clienteForm.reset();
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit(): void {
        if (this.clienteForm.invalid) {
            this.clienteForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const clienteData = this.clienteForm.value;

        if (this.isEditMode && this.idCliente) {
            this.clienteService.update(this.idCliente, clienteData).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.close.emit(true);
                    } else {
                        this.error = 'Error al actualizar el cliente';
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.error = 'Error al actualizar el cliente';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.clienteService.create(clienteData).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.close.emit(true);
                    } else {
                        this.error = 'Error al crear el cliente';
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.error = 'Error al crear el cliente';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.clienteForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.clienteForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('minlength')) {
            return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
        }
        if (field?.hasError('email')) {
            return 'Email inválido';
        }
        if (field?.hasError('pattern')) {
            return 'Formato inválido';
        }
        return '';
    }
}
