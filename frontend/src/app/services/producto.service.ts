import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoResponse } from '../models/producto.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private apiUrl = `${environment.apiUrl}/productos`;

    constructor(private http: HttpClient) { }

    obtenerProductos(): Observable<ProductoResponse> {
        return this.http.get<ProductoResponse>(this.apiUrl);
    }

    obtenerProductoPorId(id: number): Observable<ProductoResponse> {
        return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
    }

    crearProducto(producto: Producto): Observable<ProductoResponse> {
        return this.http.post<ProductoResponse>(this.apiUrl, producto);
    }

    actualizarProducto(id: number, producto: Producto): Observable<ProductoResponse> {
        return this.http.put<ProductoResponse>(`${this.apiUrl}/${id}`, producto);
    }

    eliminarProducto(id: number): Observable<ProductoResponse> {
        return this.http.delete<ProductoResponse>(`${this.apiUrl}/${id}`);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<ProductoResponse> {
        return this.obtenerProductos();
    }

    getById(id: number): Observable<ProductoResponse> {
        return this.obtenerProductoPorId(id);
    }

    create(producto: Producto): Observable<ProductoResponse> {
        return this.crearProducto(producto);
    }

    update(id: number, producto: Producto): Observable<ProductoResponse> {
        return this.actualizarProducto(id, producto);
    }

    delete(id: number): Observable<ProductoResponse> {
        return this.eliminarProducto(id);
    }
}
