export interface VentaDetalle {
    id_detalle?: number;
    id_venta?: number;
    id_producto?: number;
    id_servicio?: number;
    cantidad: number;
    precio: number;
    subtotal: number;
    // Extras para visualización
    nombre_producto?: string;
    nombre_servicio?: string;
    nombreItem?: string;
    tipo?: 'PRODUCTO' | 'SERVICIO';
}

export interface Venta {
    id_venta?: number;
    id_cliente: number;
    idusuario: number;
    id_usuario?: number;
    fecha?: string | Date;
    total: number;
    tipo_pago: string;
    monto_pagado: number;
    // Campos adicionales del JOIN
    nombre_cliente?: string;
    apellido_cliente?: string;
    clienteNombre?: string;
    nombre_usuario?: string;
    usuarioNombre?: string;
    detalles: VentaDetalle[];
}

export interface VentaRequest {
    id_cliente: number;
    id_usuario: number;
    total: number;
    tipo_pago: string;
    monto_pagado: number;
    detalles: VentaDetalle[];
}

export interface VentaResponse {
    success: boolean;
    mensaje?: string;
    data?: { id_venta: number } | Venta | Venta[];
    error?: string;
}
