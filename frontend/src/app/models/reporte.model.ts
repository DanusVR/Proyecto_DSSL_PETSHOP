export interface ReporteVenta {
    id_venta: number;
    fecha: string;
    cliente: string;
    total: number;
    usuario: string;
}

// Alias para compatibilidad
export type VentaReporte = ReporteVenta;

export interface ReporteVentasRequest {
    fechaInicio?: string;
    fechaFin?: string;
}

export interface ReporteVentasResponse {
    success: boolean;
    mensaje?: string;
    data?: ReporteVenta[];
    error?: string;
}
