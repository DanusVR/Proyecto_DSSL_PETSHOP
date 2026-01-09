import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor, ProveedorResponse } from '../models/proveedor.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    private apiUrl = `${environment.apiUrl}/proveedores`;

    constructor(private http: HttpClient) { }

    obtenerProveedores(): Observable<ProveedorResponse> {
        return this.http.get<ProveedorResponse>(this.apiUrl);
    }

    obtenerProveedorPorId(id: number): Observable<ProveedorResponse> {
        return this.http.get<ProveedorResponse>(`${this.apiUrl}/${id}`);
    }

    crearProveedor(proveedor: Proveedor): Observable<ProveedorResponse> {
        return this.http.post<ProveedorResponse>(this.apiUrl, proveedor);
    }

    actualizarProveedor(id: number, proveedor: Proveedor): Observable<ProveedorResponse> {
        return this.http.put<ProveedorResponse>(`${this.apiUrl}/${id}`, proveedor);
    }

    eliminarProveedor(id: number): Observable<ProveedorResponse> {
        return this.http.delete<ProveedorResponse>(`${this.apiUrl}/${id}`);
    }






    

    // Alias en inglés para compatibilidad
    getAll(): Observable<ProveedorResponse> {
        return this.obtenerProveedores();
    }

    getById(id: number): Observable<ProveedorResponse> {
        return this.obtenerProveedorPorId(id);
    }

    create(proveedor: Proveedor): Observable<ProveedorResponse> {
        return this.crearProveedor(proveedor);
    }

    update(id: number, proveedor: Proveedor): Observable<ProveedorResponse> {
        return this.actualizarProveedor(id, proveedor);
    }

    delete(id: number): Observable<ProveedorResponse> {
        return this.eliminarProveedor(id);
    }
}
