import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor.service';

@Component({
    selector: 'app-proveedor-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './proveedor-form.component.html',
    styleUrls: ['./proveedor-form.component.css']
})
export class ProveedorFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(ProveedorService);

    @Input() idProveedor: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    proveedorForm: FormGroup;
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    constructor() {
        this.proveedorForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            telefono: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            direccion: ['', [Validators.required]],
            tipo: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idProveedor']) {
            this.checkMode();
        }
    }

    checkMode() {
        if (this.idProveedor) {
            this.isEditMode = true;
            this.loading = true;
            this.service.getById(this.idProveedor).subscribe({
                next: (response) => {
                    if (response.data && !Array.isArray(response.data)) {
                        this.proveedorForm.patchValue({
                            ...response.data,
                            tipo: response.data.tipo ? response.data.tipo.toUpperCase() : ''
                        });

                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar el proveedor';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.proveedorForm.reset();
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.proveedorForm.invalid) {
            this.proveedorForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        if (this.isEditMode && this.idProveedor) {
            this.service.update(this.idProveedor, this.proveedorForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar el proveedor';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(this.proveedorForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear el proveedor';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.proveedorForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.proveedorForm.get(fieldName);
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
