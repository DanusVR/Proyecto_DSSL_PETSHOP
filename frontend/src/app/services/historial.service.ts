import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historial, HistorialResponse } from '../models/historial.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HistorialService {
    private apiUrl = `${environment.apiUrl}/historial`;

    constructor(private http: HttpClient) { }

    obtenerHistorial(): Observable<HistorialResponse> {
        return this.http.get<HistorialResponse>(this.apiUrl);
    }

    obtenerHistorialPorMascota(idMascota: number): Observable<HistorialResponse> {
        return this.http.get<HistorialResponse>(`${this.apiUrl}/mascota/${idMascota}`);
    }

    obtenerHistorialPorId(id: number): Observable<HistorialResponse> {
        return this.http.get<HistorialResponse>(`${this.apiUrl}/${id}`);
    }

    crearHistorial(historial: Historial): Observable<HistorialResponse> {
        return this.http.post<HistorialResponse>(this.apiUrl, historial);
    }

    actualizarHistorial(id: number, historial: Historial): Observable<HistorialResponse> {
        return this.http.put<HistorialResponse>(`${this.apiUrl}/${id}`, historial);
    }

    eliminarHistorial(id: number): Observable<HistorialResponse> {
        return this.http.delete<HistorialResponse>(`${this.apiUrl}/${id}`);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<HistorialResponse> {
        return this.obtenerHistorial();
    }

    getById(id: number): Observable<HistorialResponse> {
        return this.obtenerHistorialPorId(id);
    }

    create(historial: Historial): Observable<HistorialResponse> {
        return this.crearHistorial(historial);
    }

    update(id: number, historial: Historial): Observable<HistorialResponse> {
        return this.actualizarHistorial(id, historial);
    }

    delete(id: number): Observable<HistorialResponse> {
        return this.eliminarHistorial(id);
    }
}
