import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MascotaService } from '../../../services/mascota.service';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';

@Component({
    selector: 'app-mascota-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './mascota-form.component.html',
    styleUrls: ['./mascota-form.component.css']
})
export class MascotaFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(MascotaService);
    private clienteService = inject(ClienteService);

    @Input() idMascota: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    mascotaForm: FormGroup;
    clientes: Cliente[] = [];
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    especies: string[] = ['Perro', 'Gato'];
    sexos: string[] = ['Macho', 'Hembra'];

    constructor() {
        this.mascotaForm = this.fb.group({
            id_cliente: [null, [Validators.required]],
            nombre_mascota: ['', [Validators.required, Validators.minLength(2)]],
            especie: ['', [Validators.required]],
            raza: [''],
            edad: [0, [Validators.min(0)]],
            sexo: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.loadClientes();
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idMascota']) {
            this.checkMode();
        }
    }

    loadClientes() {
        this.clienteService.getAll().subscribe({
            next: (response) => {
                this.clientes = Array.isArray(response.data) ? response.data : [];
            },
            error: (err) => console.error('Error al cargar clientes', err)
        });
    }

    checkMode() {
        if (this.idMascota) {
            this.isEditMode = true;
            this.loading = true;
            this.service.getById(this.idMascota).subscribe({
                next: (response) => {
                    if (response.data && !Array.isArray(response.data)) {
                        const data = response.data;

                        // Normalize Especie
                        const incomingEspecie = data.especie || 'Perro';
                        const matchedEspecie = this.especies.find(e => e.toLowerCase() === incomingEspecie.toLowerCase()) || 'Perro';

                        // Normalize Sexo
                        // Handle potential 'M'/'H' legacy values if any, map to full words if needed, or just match
                        let incomingSexo = data.sexo || 'Macho';
                        // Map M/H to Macho/Hembra just in case
                        if (incomingSexo === 'M') incomingSexo = 'Macho';
                        if (incomingSexo === 'H') incomingSexo = 'Hembra';

                        const matchedSexo = this.sexos.find(s => s.toLowerCase() === incomingSexo.toLowerCase()) || 'Macho';

                        this.mascotaForm.patchValue({
                            ...data,
                            especie: matchedEspecie,
                            sexo: matchedSexo
                        });
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar la mascota';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.mascotaForm.reset();
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.mascotaForm.invalid) {
            this.mascotaForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        if (this.isEditMode && this.idMascota) {
            this.service.update(this.idMascota, this.mascotaForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar la mascota';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(this.mascotaForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear la mascota';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.mascotaForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.mascotaForm.get(fieldName);
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
