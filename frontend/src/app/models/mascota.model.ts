export interface Mascota {
    id_mascota?: number;
    id_cliente: number;
    nombre_mascota: string;
    nombre?: string; // Alias para nombre_mascota
    especie: string;
    raza: string;
    edad: number;
    sexo: string;
    color?: string;
    estado?: string;
    // Campos adicionales del JOIN
    nombre_cliente?: string;
    apellido_cliente?: string;
    cliente_completo?: string;
}

export interface MascotaRequest {
    id_cliente: number;
    nombre_mascota: string;
    especie: string;
    raza: string;
    edad: number;
    sexo: string;
}

export interface MascotaResponse {
    success: boolean;
    mensaje?: string;
    data?: Mascota | Mascota[];
    error?: string;
}

