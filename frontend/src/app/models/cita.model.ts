export interface Cita {
    id_cita?: number;
    id_cliente?: number;
    id_mascota: number;
    id_servicio?: number; // Legacy/Main service
    fecha: string;
    hora: string;
    estado: string;
    observacion: string;
    // Campos adicionales del JOIN
    nombre_cliente?: string;
    nombre_mascota?: string;
    nombre_servicio?: string;
    servicios?: any[]; // Array of details
    cantidad_servicios?: number;
}

export interface CitaRequest {
    id_mascota: number;
    servicios: number[]; // Array of Service IDs
    fecha: string;
    hora: string;
    estado?: string;
    observacion?: string;
}

export interface CitaResponse {
    success: boolean;
    mensaje?: string;
    data?: Cita | Cita[];
    error?: string;
}
