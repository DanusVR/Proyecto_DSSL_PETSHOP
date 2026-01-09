import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVentasResponse } from '../models/reporte.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private apiUrl = `${environment.apiUrl}/reportes`;

    constructor(private http: HttpClient) { }

    obtenerReporteVentas(fechaInicio?: string, fechaFin?: string): Observable<ReporteVentasResponse> {
        let url = `${this.apiUrl}/ventas`;
        const params: string[] = [];

        if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
        if (fechaFin) params.push(`fechaFin=${fechaFin}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return this.http.get<ReporteVentasResponse>(url);
    }







    

    // Alias para compatibilidad
    getVentas(filters?: any): Observable<ReporteVentasResponse> {
        return this.obtenerReporteVentas(filters?.fechaInicio, filters?.fechaFin);
    }
}
