import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../services/compra.service';
import { Compra } from '../../../models/compra.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-compra-boleta',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './compra-boleta.component.html',
    styleUrl: './compra-boleta.component.css',
    encapsulation: ViewEncapsulation.None
})
export class CompraBoletaComponent implements OnChanges {
    @Input() idCompra: number | null = null;
    @Output() close = new EventEmitter<void>();

    private compraService = inject(CompraService);
    compra: Compra | null = null;
    loading: boolean = false;
    error: string = '';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idCompra'] && this.idCompra) {
            this.loadCompra(this.idCompra);
        }
    }

    loadCompra(id: number) {
        this.loading = true;
        this.error = '';
        this.compraService.getById(id).subscribe({
            next: (resp) => {
                if (resp.success && resp.data && !Array.isArray(resp.data)) {
                    this.compra = resp.data as Compra;
                    // Normalizar nombres si es necesario
                    if (this.compra.detalles) {
                        this.compra.detalles = this.compra.detalles.map(d => ({
                            ...d,
                            nombre_producto: d.nombre_producto || 'Producto desconocido'
                        }));
                    }
                } else {
                    this.error = 'No se encontró la compra.';
                }
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar la boleta.';
                this.loading = false;
            }
        });
    }

    onClose() {
        this.close.emit();
    }

    print() {
        window.print();
    }

    exportarPDF() {
        const data = document.querySelector('.boleta-container') as HTMLElement;
        if (!data) return;

        this.loading = true;
        html2canvas(data, { scale: 2 }).then(canvas => {
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Boleta_Compra_${this.compra?.id_compra}.pdf`);
            this.loading = false;
        }).catch(err => {
            console.error('Error exporting PDF', err);
            this.loading = false;
        });
    }
}
