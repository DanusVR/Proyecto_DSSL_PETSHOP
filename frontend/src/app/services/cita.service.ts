import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CitaResponse } from '../models/cita.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CitaService {
    private apiUrl = `${environment.apiUrl}/citas`;

    constructor(private http: HttpClient) { }

    obtenerCitas(): Observable<CitaResponse> {
        return this.http.get<CitaResponse>(this.apiUrl);
    }

    obtenerCitaPorId(id: number): Observable<CitaResponse> {
        return this.http.get<CitaResponse>(`${this.apiUrl}/${id}`);
    }

    crearCita(cita: Cita): Observable<CitaResponse> {
        return this.http.post<CitaResponse>(this.apiUrl, cita);
    }

    actualizarCita(id: number, cita: Cita): Observable<CitaResponse> {
        return this.http.put<CitaResponse>(`${this.apiUrl}/${id}`, cita);
    }

    eliminarCita(id: number): Observable<CitaResponse> {
        return this.http.delete<CitaResponse>(`${this.apiUrl}/${id}`);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<CitaResponse> {
        return this.obtenerCitas();
    }

    getById(id: number): Observable<CitaResponse> {
        return this.obtenerCitaPorId(id);
    }

    create(cita: Cita): Observable<CitaResponse> {
        return this.crearCita(cita);
    }

    update(id: number, cita: Cita): Observable<CitaResponse> {
        return this.actualizarCita(id, cita);
    }

    delete(id: number): Observable<CitaResponse> {
        return this.eliminarCita(id);
    }
}
