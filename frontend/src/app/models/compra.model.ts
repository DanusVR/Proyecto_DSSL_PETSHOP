export interface CompraDetalle {
    id_compra_detalle?: number;
    id_compra?: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    // Extras
    nombre_producto?: string;
}

export interface Compra {
    id_compra?: number;
    id_proveedor: number;
    fecha_compra?: string;
    total: number;
    estado?: string;
    tipo_comprobante?: string;
    numero_comprobante?: string;
    // Campos adicionales del JOIN
    nombre_proveedor?: string;
    detalles: CompraDetalle[];
}

export interface CompraRequest {
    id_proveedor: number;
    total: number;
    estado?: string;
    detalles: CompraDetalle[];
}

export interface CompraResponse {
    success: boolean;
    mensaje?: string;
    data?: { id_compra: number } | Compra | Compra[];
    error?: string;
}
