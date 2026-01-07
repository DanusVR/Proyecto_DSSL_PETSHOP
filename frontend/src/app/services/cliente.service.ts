import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, ClienteResponse } from '../models/cliente.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    obtenerClientes(): Observable<ClienteResponse> {
        return this.http.get<ClienteResponse>(this.apiUrl);
    }

    obtenerClientePorId(id: number): Observable<ClienteResponse> {
        return this.http.get<ClienteResponse>(`${this.apiUrl}/${id}`);
    }

    crearCliente(cliente: Cliente): Observable<ClienteResponse> {
        return this.http.post<ClienteResponse>(this.apiUrl, cliente);
    }

    actualizarCliente(id: number, cliente: Cliente): Observable<ClienteResponse> {
        return this.http.put<ClienteResponse>(`${this.apiUrl}/${id}`, cliente);
    }

    eliminarCliente(id: number): Observable<ClienteResponse> {
        return this.http.delete<ClienteResponse>(`${this.apiUrl}/${id}`);
    }

    // Alias en inglés para compatibilidad
    getAll(): Observable<ClienteResponse> {
        return this.obtenerClientes();
    }

    getById(id: number): Observable<ClienteResponse> {
        return this.obtenerClientePorId(id);
    }

    create(cliente: Cliente): Observable<ClienteResponse> {
        return this.crearCliente(cliente);
    }

    update(id: number, cliente: Cliente): Observable<ClienteResponse> {
        return this.actualizarCliente(id, cliente);
    }

    delete(id: number): Observable<ClienteResponse> {
        return this.eliminarCliente(id);
    }
}
