import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
    selector: 'app-usuario-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './usuario-form.component.html',
    styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(UsuarioService);

    @Input() idUsuario: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    usuarioForm: FormGroup;
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    constructor() {
        this.usuarioForm = this.fb.group({
            nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
            nombre_usuario: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rol: ['USUARIO', [Validators.required]],
            estado: ['ACTIVO', [Validators.required]]
        });
    }

    ngOnInit() {
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idUsuario']) {
            this.checkMode();
        }
    }

    checkMode() {
        if (this.idUsuario) {
            this.isEditMode = true;
            this.loading = true;
            // En modo edición, la contraseña es opcional
            this.usuarioForm.get('password')?.clearValidators();
            this.usuarioForm.get('password')?.updateValueAndValidity();

            this.service.getById(this.idUsuario).subscribe({
                next: (response) => {
                    if (response.data && !Array.isArray(response.data)) {
                        this.usuarioForm.patchValue({
                            ...response.data,
                            rol: response.data.rol ? response.data.rol.toUpperCase() : 'USUARIO',
                            estado: response.data.estado ? response.data.estado.toUpperCase() : 'ACTIVO'
                        });

                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar el usuario';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            // En modo creación, la contraseña es obligatoria
            this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
            this.usuarioForm.get('password')?.updateValueAndValidity();
            this.usuarioForm.reset({ rol: 'USUARIO', estado: 'ACTIVO' });
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.usuarioForm.invalid) {
            this.usuarioForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const usuarioData = { ...this.usuarioForm.value };
        // Si es edición y no se cambió la contraseña, no la enviamos
        if (this.isEditMode && !usuarioData.password) {
            delete usuarioData.password;
        }

        if (this.isEditMode && this.idUsuario) {
            this.service.update(this.idUsuario, usuarioData).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar el usuario';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(usuarioData).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear el usuario';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.usuarioForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.usuarioForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('minlength')) {
            return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
        }
        if (field?.hasError('email')) {
            return 'Email inválido';
        }
        return '';
    }
}
