import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, AuthResponse } from '../models/usuario.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    obtenerUsuarios(): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(this.apiUrl);
    }

    obtenerUsuarioPorId(id: number): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(`${this.apiUrl}/${id}`);
    }

    crearUsuario(usuario: Usuario): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl, usuario);
    }

    actualizarUsuario(id: number, usuario: Usuario): Observable<AuthResponse> {
        return this.http.put<AuthResponse>(`${this.apiUrl}/${id}`, usuario);
    }

    eliminarUsuario(id: number): Observable<AuthResponse> {
        return this.http.delete<AuthResponse>(`${this.apiUrl}/${id}`);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<AuthResponse> {
        return this.obtenerUsuarios();
    }

    getById(id: number): Observable<AuthResponse> {
        return this.obtenerUsuarioPorId(id);
    }

    create(usuario: Usuario): Observable<AuthResponse> {
        return this.crearUsuario(usuario);
    }

    update(id: number, usuario: Usuario): Observable<AuthResponse> {
        return this.actualizarUsuario(id, usuario);
    }

    delete(id: number): Observable<AuthResponse> {
        return this.eliminarUsuario(id);
    }
}
