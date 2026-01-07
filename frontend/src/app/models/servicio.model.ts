export interface Servicio {
    id_servicio?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: string;
    estado: string;
}

export interface ServicioRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    estado?: string;
}

export interface ServicioResponse {
    success: boolean;
    mensaje?: string;
    data?: Servicio | Servicio[];
    error?: string;
}

