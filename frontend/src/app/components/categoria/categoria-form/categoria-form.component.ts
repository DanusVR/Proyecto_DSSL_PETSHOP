import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
    selector: 'app-categoria-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './categoria-form.component.html',
    styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private service = inject(CategoriaService);

    @Input() idCategoria: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    categoriaForm: FormGroup;
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    constructor() {
        this.categoriaForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            descripcion: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idCategoria']) {
            this.checkMode();
        }
    }

    checkMode() {
        if (this.idCategoria) {
            this.isEditMode = true;
            this.loading = true;
            this.service.getById(this.idCategoria).subscribe({
                next: (response) => {
                    if (response.data && !Array.isArray(response.data)) {
                        this.categoriaForm.patchValue(response.data);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar la categoría';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.categoriaForm.reset({ nombre: '', descripcion: '' });
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit() {
        if (this.categoriaForm.invalid) {
            this.categoriaForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        if (this.isEditMode && this.idCategoria) {
            this.service.update(this.idCategoria, this.categoriaForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al actualizar la categoría';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.service.create(this.categoriaForm.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.close.emit(true);
                },
                error: (err) => {
                    this.error = 'Error al crear la categoría';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.categoriaForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.categoriaForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('minlength')) {
            return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
        }
        return '';
    }
}
