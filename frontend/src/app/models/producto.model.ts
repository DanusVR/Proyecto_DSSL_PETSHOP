export interface Producto {
    id_producto?: number;
    nombre: string;
    id_categoria: number;
    descripcion: string;
    stock: number;
    precio_costo: number;
    precio_venta: number;
    estado: string;
    // Campos adicionales del JOIN
    nombre_categoria?: string;
    nombreCat?: string; // Alias para nombre_categoria
}

export interface ProductoRequest {
    nombre: string;
    id_categoria: number;
    descripcion: string;
    stock: number;
    precio_costo: number;
    precio_venta: number;
    estado?: string;
}

export interface ProductoResponse {
    success: boolean;
    mensaje?: string;
    data?: Producto | Producto[];
    error?: string;
}
