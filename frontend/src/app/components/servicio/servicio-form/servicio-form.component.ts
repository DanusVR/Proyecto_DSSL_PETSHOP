import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioService } from '../../../services/servicio.service';

@Component({
    selector: 'app-servicio-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './servicio-form.component.html',
    styleUrls: ['./servicio-form.component.css']
})
export class ServicioFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(ServicioService);

    @Input() idServicio: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    servicioForm: FormGroup;
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    tipos: string[] = ['Baño', 'Vacuna', 'Consulta', 'Peluquería'];
    estados: string[] = ['Activo', 'Inactivo'];

    constructor() {
        this.servicioForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            descripcion: ['', [Validators.required]],
            tipo: ['Baño', [Validators.required]],
            precio: [0, [Validators.required, Validators.min(0)]],
            estado: ['Activo', [Validators.required]]
        });
    }

    ngOnInit() {
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idServicio']) {
            this.checkMode();
        }
    }

    checkMode() {
        if (this.idServicio) {
            this.isEditMode = true;
            this.loading = true;
            this.service.getById(this.idServicio).subscribe({
                next: (response) => {
                    if (response.data && !Array.isArray(response.data)) {
                        const data = response.data;

                        // Normalize Tipo
                        const incomingTipo = data.tipo || 'Baño';
                        const matchedTipo = this.tipos.find(t => t.toLowerCase() === incomingTipo.toLowerCase()) || 'Baño';

                        // Normalize Estado
                        const incomingEstado = data.estado || 'Activo';
                        const matchedEstado = this.estados.find(e => e.toLowerCase() === incomingEstado.toLowerCase()) || 'Activo';

                        this.servicioForm.patchValue({
                            ...data,
                            tipo: matchedTipo,
                            estado: matchedEstado
                        });
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar el servicio';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.servicioForm.reset({ estado: 'ACTIVO', precio: 0 });
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.servicioForm.invalid) {
            this.servicioForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        if (this.isEditMode && this.idServicio) {
            this.service.update(this.idServicio, this.servicioForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar el servicio';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(this.servicioForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear el servicio';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.servicioForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.servicioForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('minlength')) {
            return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
        }
        if (field?.hasError('min')) {
            return `Valor mínimo: ${field.errors?.['min'].min}`;
        }
        return '';
    }
}
