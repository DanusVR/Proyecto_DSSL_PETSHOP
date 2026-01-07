export interface Proveedor {
    id_proveedor?: number;
    nombre: string;
    razon_social?: string; // Alias para nombre
    ruc: string;
    telefono: string;
    correo: string;
    direccion: string;
    tipo: string;
    estado?: string;
}

export interface ProveedorRequest {
    nombre: string;
    ruc: string;
    telefono: string;
    correo: string;
    direccion: string;
    tipo: string;
    estado?: string;
}

export interface ProveedorResponse {
    success: boolean;
    mensaje?: string;
    data?: Proveedor | Proveedor[];
    error?: string;
}
