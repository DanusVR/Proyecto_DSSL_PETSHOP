import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra, CompraResponse } from '../models/compra.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompraService {
    private apiUrl = `${environment.apiUrl}/compras`;

    constructor(private http: HttpClient) { }

    obtenerCompras(): Observable<CompraResponse> {
        return this.http.get<CompraResponse>(this.apiUrl);
    }

    obtenerCompraPorId(id: number): Observable<CompraResponse> {
        return this.http.get<CompraResponse>(`${this.apiUrl}/${id}`);
    }

    crearCompra(compra: Compra): Observable<CompraResponse> {
        return this.http.post<CompraResponse>(this.apiUrl, compra);
    }

    anularCompra(id: number): Observable<CompraResponse> {
        return this.http.put<CompraResponse>(`${this.apiUrl}/${id}/anular`, {});
    }










    
    getAll(): Observable<CompraResponse> {
        return this.obtenerCompras();
    }

    getById(id: number): Observable<CompraResponse> {
        return this.obtenerCompraPorId(id);
    }

    create(compra: Compra): Observable<CompraResponse> {
        return this.crearCompra(compra);
    }
}
