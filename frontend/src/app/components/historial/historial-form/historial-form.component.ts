import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistorialService } from '../../../services/historial.service';
import { MascotaService } from '../../../services/mascota.service';
import { Mascota } from '../../../models/mascota.model';

@Component({
    selector: 'app-historial-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './historial-form.component.html',
    styleUrls: ['./historial-form.component.css']
})
export class HistorialFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(HistorialService);
    private mascotaService = inject(MascotaService);

    @Input() idHistorial: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    historialForm: FormGroup;
    mascotas: Mascota[] = [];
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    constructor() {
        this.historialForm = this.fb.group({
            id_mascota: [null, [Validators.required]],
            fecha: ['', [Validators.required]],
            descripcion: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit() {
        this.loadMascotas();
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idHistorial']) {
            this.checkMode();
        }
    }

    loadMascotas() {
        this.mascotaService.getAll().subscribe({
            next: (response) => {
                this.mascotas = Array.isArray(response.data) ? response.data : [];
            },
            error: (err) => console.error('Error al cargar mascotas', err)
        });
    }

    checkMode() {
        if (this.idHistorial) {
            this.isEditMode = true;
            this.loading = true;
            this.service.getById(this.idHistorial).subscribe({
                next: (response) => {
                    if (response.data && !Array.isArray(response.data)) {
                        this.historialForm.patchValue({
                            ...response.data,
                            fecha: response.data.fecha ? new Date(response.data.fecha).toISOString().split('T')[0] : ''
                        });

                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar el historial';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.historialForm.reset();
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.historialForm.invalid) {
            this.historialForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        if (this.isEditMode && this.idHistorial) {
            this.service.update(this.idHistorial, this.historialForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar el historial';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(this.historialForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear el historial';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.historialForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.historialForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('minlength')) {
            return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
        }
        return '';
    }
}
