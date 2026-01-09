import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../services/cita.service';
import { MascotaService } from '../../../services/mascota.service';
import { ServicioService } from '../../../services/servicio.service';
import { Mascota } from '../../../models/mascota.model';
import { Servicio } from '../../../models/servicio.model';

@Component({
    selector: 'app-cita-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cita-form.component.html',
    styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(CitaService);
    private mascotaService = inject(MascotaService);
    private servicioService = inject(ServicioService);

    @Input() idCita: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    citaForm: FormGroup;
    mascotas: Mascota[] = [];
    servicios: Servicio[] = [];
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    selectedServices: any[] = [];
    constructor() {
        this.citaForm = this.fb.group({
            id_mascota: [null, [Validators.required]],
            servicios: [[], [Validators.required]], 
            fecha: ['', [Validators.required]],
            hora: ['', [Validators.required]],
            estado: ['PENDIENTE']
        });
    }

    ngOnInit() {
        this.loadData();
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idCita']) {
            this.checkMode();
        }
    }

    loadData() {
        this.mascotaService.getAll().subscribe({
            next: (response) => {
                this.mascotas = Array.isArray(response.data) ? response.data : [];
            },
            error: (err) => console.error('Error al cargar mascotas', err)
        });

        this.mascotaService.getAll().subscribe({
            next: (response) => {
                this.mascotas = Array.isArray(response.data) ? response.data : [];
            },
            error: (err) => console.error('Error al cargar mascotas', err)
        });

        this.servicioService.getAll().subscribe({
            next: (response) => {
                this.servicios = Array.isArray(response.data) ? response.data : [];
            },
            error: (err) => console.error('Error al cargar servicios', err)
        });
    }

    checkMode() {
        if (this.idCita) {
            this.isEditMode = true;
            this.loading = true;
            this.service.getById(this.idCita).subscribe({
                next: (response) => {
                    const data: any = response.data;
                    if (data) {
                       
                        this.citaForm.patchValue({
                            id_mascota: data.id_mascota,
                            fecha: data.fecha ? new Date(data.fecha).toISOString().split('T')[0] : '',
                            hora: data.hora,
                            
                            estado: data.estado
                        });

                       
                        if (data.servicios && Array.isArray(data.servicios)) {
                            this.selectedServices = data.servicios.map((s: any) => ({
                                id_servicio: s.id_servicio,
                                nombre: s.nombre_servicio,
                                precio: s.precio
                            }));
                            const serviceIds = this.selectedServices.map(s => s.id_servicio);
                            this.citaForm.patchValue({ servicios: serviceIds });
                        }
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar la cita';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.selectedServices = [];
            this.citaForm.reset({ estado: 'PENDIENTE', servicios: [] });
        }
    }

    addService(idService: string) {
        const id = Number(idService);
        if (!id) return;

        const service = this.servicios.find(s => s.id_servicio == id);
        if (service) {
           
            if (!this.selectedServices.some(s => s.id_servicio === id)) {
                this.selectedServices.push({
                    id_servicio: service.id_servicio,
                    nombre: service.nombre,
                    precio: service.precio
                });
                this.updateServiciosControl();
            }
        }
    }

    removeService(index: number) {
        this.selectedServices.splice(index, 1);
        this.updateServiciosControl();
    }

    updateServiciosControl() {
        const ids = this.selectedServices.map(s => s.id_servicio);
        this.citaForm.patchValue({ servicios: ids });
        this.citaForm.get('servicios')?.markAsDirty();
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.citaForm.invalid) {
            this.citaForm.markAllAsTouched();
            return;
        }
       
        if (this.selectedServices.length === 0) {
            this.error = 'Debe seleccionar al menos un servicio';
            return;
        }

        this.loading = true;
        this.error = '';

        if (this.isEditMode && this.idCita) {
            this.service.update(this.idCita, this.citaForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar la cita';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(this.citaForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear la cita';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.citaForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.citaForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        return '';
    }
}
