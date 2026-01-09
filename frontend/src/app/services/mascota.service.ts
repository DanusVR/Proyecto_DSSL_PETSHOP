import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota, MascotaResponse } from '../models/mascota.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MascotaService {
    private apiUrl = `${environment.apiUrl}/mascotas`;

    constructor(private http: HttpClient) { }

    obtenerMascotas(): Observable<MascotaResponse> {
        return this.http.get<MascotaResponse>(this.apiUrl);
    }

    obtenerMascotaPorId(id: number): Observable<MascotaResponse> {
        return this.http.get<MascotaResponse>(`${this.apiUrl}/${id}`);
    }

    crearMascota(mascota: Mascota): Observable<MascotaResponse> {
        return this.http.post<MascotaResponse>(this.apiUrl, mascota);
    }

    actualizarMascota(id: number, mascota: Mascota): Observable<MascotaResponse> {
        return this.http.put<MascotaResponse>(`${this.apiUrl}/${id}`, mascota);
    }

    eliminarMascota(id: number): Observable<MascotaResponse> {
        return this.http.delete<MascotaResponse>(`${this.apiUrl}/${id}`);
    }








    
    // Alias en inglés para compatibilidad
    getAll(): Observable<MascotaResponse> {
        return this.obtenerMascotas();
    }

    getById(id: number): Observable<MascotaResponse> {
        return this.obtenerMascotaPorId(id);
    }

    create(mascota: Mascota): Observable<MascotaResponse> {
        return this.crearMascota(mascota);
    }

    update(id: number, mascota: Mascota): Observable<MascotaResponse> {
        return this.actualizarMascota(id, mascota);
    }

    delete(id: number): Observable<MascotaResponse> {
        return this.eliminarMascota(id);
    }
}
