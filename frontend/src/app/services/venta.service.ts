import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaResponse } from '../models/venta.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VentaService {
    private apiUrl = `${environment.apiUrl}/ventas`;

    constructor(private http: HttpClient) { }

    obtenerVentas(): Observable<VentaResponse> {
        return this.http.get<VentaResponse>(this.apiUrl);
    }

    obtenerVentaPorId(id: number): Observable<VentaResponse> {
        return this.http.get<VentaResponse>(`${this.apiUrl}/${id}`);
    }

    crearVenta(venta: Venta): Observable<VentaResponse> {
        return this.http.post<VentaResponse>(this.apiUrl, venta);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<VentaResponse> {
        return this.obtenerVentas();
    }

    getById(id: number): Observable<VentaResponse> {
        return this.obtenerVentaPorId(id);
    }

    create(venta: Venta): Observable<VentaResponse> {
        return this.crearVenta(venta);
    }
}
