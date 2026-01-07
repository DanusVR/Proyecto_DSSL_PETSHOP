export interface Categoria {
    id_categoria?: number;
    nombre: string;
    descripcion: string;
    estado: string;
}

export interface CategoriaRequest {
    nombre: string;
    descripcion: string;
    estado?: string;
}

export interface CategoriaResponse {
    success: boolean;
    mensaje?: string;
    data?: Categoria | Categoria[];
    error?: string;
}

