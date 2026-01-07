export interface Cliente {
    id_cliente?: number;
    nombreC: string;
    nombre?: string; // Alias para nombreC
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;
    direccion: string;
    estado?: string;
}

export interface ClienteRequest {
    nombreC: string;
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;
    direccion: string;
    estado?: string;
}

export interface ClienteResponse {
    success: boolean;
    mensaje?: string;
    data?: Cliente | Cliente[];
    error?: string;
}

