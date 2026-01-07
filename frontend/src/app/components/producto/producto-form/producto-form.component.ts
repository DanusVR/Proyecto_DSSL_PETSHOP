import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

@Component({
    selector: 'app-producto-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './producto-form.component.html',
    styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private productoService = inject(ProductoService);
    private categoriaService = inject(CategoriaService);

    @Input() idProducto: number | null = null;
    @Output() close = new EventEmitter<boolean>();

    productoForm: FormGroup;
    categorias: Categoria[] = [];
    isEditMode: boolean = false;
    loading: boolean = false;
    error: string = '';

    constructor() {
        this.productoForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            id_categoria: ['', [Validators.required]],
            descripcion: [''],
            stock: [0, [Validators.required, Validators.min(0)]],
            precio_costo: [0, [Validators.required, Validators.min(0)]],
            precio_venta: [0, [Validators.required, Validators.min(0)]],
            estado: ['Activo'] // Default to Activo
        });
    }

    ngOnInit(): void {
        this.loadCategorias();
        this.checkMode();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idProducto']) {
            this.checkMode();
        }
    }

    loadCategorias(): void {
        this.categoriaService.getAll().subscribe({
            next: (response) => {
                this.categorias = Array.isArray(response.data) ? response.data : [];
            },
            error: (err) => console.error('Error al cargar categorías', err)
        });
    }

    checkMode() {
        if (this.idProducto) {
            this.isEditMode = true;
            this.loading = true;
            this.productoService.getById(this.idProducto).subscribe({
                next: (response) => {
                    if (response.success && response.data && !Array.isArray(response.data)) {
                        this.productoForm.patchValue(response.data);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar el producto';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.isEditMode = false;
            this.productoForm.reset();
            // Optional: Set default values for numbers to 0
            this.productoForm.patchValue({ stock: 0, precio_costo: 0, precio_venta: 0 });
        }
    }

    onCancel() {
        this.close.emit(false);
    }

    onSubmit(): void {
        if (this.productoForm.invalid) {
            this.productoForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const productoData = this.productoForm.value;

        if (this.isEditMode && this.idProducto) {
            this.productoService.update(this.idProducto, productoData).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.close.emit(true);
                    } else {
                        this.error = 'Error al actualizar el producto';
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.error = 'Error al actualizar el producto';
                    console.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.productoService.create(productoData).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.close.emit(true);
                    } else {
                        this.error = 'Error al crear el producto';
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.error = 'Error al crear el producto';
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.productoForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.productoForm.get(fieldName);
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
