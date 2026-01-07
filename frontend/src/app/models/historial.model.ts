export interface Historial {
    id_historial?: number;
    id_mascota: number;
    fecha: string;
    descripcion: string;
    observaciones?: string; // Alias para descripcion
    // Campos adicionales del JOIN
    nombre_mascota?: string;
}

export interface HistorialRequest {
    id_mascota: number;
    fecha: string;
    descripcion: string;
}

export interface HistorialResponse {
    success: boolean;
    mensaje?: string;
    data?: Historial | Historial[];
    error?: string;
}
