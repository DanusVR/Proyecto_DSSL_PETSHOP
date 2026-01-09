import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaResponse } from '../models/categoria.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    private apiUrl = `${environment.apiUrl}/categorias`;

    constructor(private http: HttpClient) { }

    obtenerCategorias(): Observable<CategoriaResponse> {
        return this.http.get<CategoriaResponse>(this.apiUrl);
    }

    obtenerCategoriaPorId(id: number): Observable<CategoriaResponse> {
        return this.http.get<CategoriaResponse>(`${this.apiUrl}/${id}`);
    }

    crearCategoria(categoria: Categoria): Observable<CategoriaResponse> {
        return this.http.post<CategoriaResponse>(this.apiUrl, categoria);
    }

    actualizarCategoria(id: number, categoria: Categoria): Observable<CategoriaResponse> {
        return this.http.put<CategoriaResponse>(`${this.apiUrl}/${id}`, categoria);
    }

    eliminarCategoria(id: number): Observable<CategoriaResponse> {
        return this.http.delete<CategoriaResponse>(`${this.apiUrl}/${id}`);
    }






    

    // Alias en inglés para compatibilidad
    getAll(): Observable<CategoriaResponse> {
        return this.obtenerCategorias();
    }

    getById(id: number): Observable<CategoriaResponse> {
        return this.obtenerCategoriaPorId(id);
    }

    create(categoria: Categoria): Observable<CategoriaResponse> {
        return this.crearCategoria(categoria);
    }

    update(id: number, categoria: Categoria): Observable<CategoriaResponse> {
        return this.actualizarCategoria(id, categoria);
    }

    delete(id: number): Observable<CategoriaResponse> {
        return this.eliminarCategoria(id);
    }
}
