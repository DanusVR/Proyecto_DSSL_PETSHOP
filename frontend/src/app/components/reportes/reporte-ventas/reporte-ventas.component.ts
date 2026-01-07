import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReporteService } from '../../../services/reporte.service';
import { VentaReporte } from '../../../models/reporte.model';

@Component({
    selector: 'app-reporte-ventas',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './reporte-ventas.component.html',
    styleUrl: './reporte-ventas.component.css'
})
export class ReporteVentasComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(ReporteService);

    filterForm = this.fb.group({
        fechaInicio: [''],
        fechaFin: ['']
    });

    reportData: VentaReporte[] = [];

    ngOnInit() {
        // Can load initial data if needed, or wait for filter
    }

    loadReport() {
        const filters = this.filterForm.value;
        this.service.getVentas(filters).subscribe((response) => {
            this.reportData = Array.isArray(response.data) ? response.data : [];
        });
    }
}
