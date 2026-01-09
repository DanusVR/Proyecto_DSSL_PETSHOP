import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../models/venta.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-venta-boleta',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './venta-boleta.component.html',
    styleUrl: './venta-boleta.component.css',
    encapsulation: ViewEncapsulation.None
})
export class VentaBoletaComponent implements OnChanges {
    @Input() idVenta: number | null = null;
    @Output() close = new EventEmitter<void>();

    private ventaService = inject(VentaService);
    venta: Venta | null = null;
    loading: boolean = false;
    error: string = '';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idVenta'] && this.idVenta) {
            this.cargarVenta(this.idVenta);
        }
    }

    cargarVenta(id: number) {
        this.loading = true;
        this.error = '';
        this.ventaService.getById(id).subscribe({
            next: (resp) => {
                if (resp.success && resp.data && !Array.isArray(resp.data)) {
                    this.venta = resp.data as Venta;
                    
                    if (this.venta.detalles) {
                        this.venta.detalles = this.venta.detalles.map(d => ({
                            ...d,
                            nombreItem: d.nombre_producto || d.nombre_servicio || 'Item desconocido'
                        }));
                    }
                } else {
                    this.error = 'No se encontró la venta.';
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
            const pageHeight = 295; 
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const position = 0;

            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save(`Boleta_Venta_${this.venta?.id_venta}.pdf`);
            this.loading = false;
        }).catch(err => {
            console.error('Error exporting PDF', err);
            this.loading = false;
        });
    }
}
