import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio, ServicioResponse } from '../models/servicio.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ServicioService {
    private apiUrl = `${environment.apiUrl}/servicios`;

    constructor(private http: HttpClient) { }

    obtenerServicios(): Observable<ServicioResponse> {
        return this.http.get<ServicioResponse>(this.apiUrl);
    }

    obtenerServicioPorId(id: number): Observable<ServicioResponse> {
        return this.http.get<ServicioResponse>(`${this.apiUrl}/${id}`);
    }

    crearServicio(servicio: Servicio): Observable<ServicioResponse> {
        return this.http.post<ServicioResponse>(this.apiUrl, servicio);
    }

    actualizarServicio(id: number, servicio: Servicio): Observable<ServicioResponse> {
        return this.http.put<ServicioResponse>(`${this.apiUrl}/${id}`, servicio);
    }

    eliminarServicio(id: number): Observable<ServicioResponse> {
        return this.http.delete<ServicioResponse>(`${this.apiUrl}/${id}`);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<ServicioResponse> {
        return this.obtenerServicios();
    }

    getById(id: number): Observable<ServicioResponse> {
        return this.obtenerServicioPorId(id);
    }

    create(servicio: Servicio): Observable<ServicioResponse> {
        return this.crearServicio(servicio);
    }

    update(id: number, servicio: Servicio): Observable<ServicioResponse> {
        return this.actualizarServicio(id, servicio);
    }

    delete(id: number): Observable<ServicioResponse> {
        return this.eliminarServicio(id);
    }
}
