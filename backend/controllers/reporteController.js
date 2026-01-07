const db = require('../config/database');

/**
 * Reporte de ventas por rango de fechas
 * GET /api/reportes/ventas
 */
const obtenerReporteVentas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({
                success: false,
                mensaje: "Fechas de inicio y fin son obligatorias"
            });
        }

        const sql = `
            SELECT 
                v.id_venta,
                v.fecha,
                c.nombreC AS cliente,
                u.nombre_usuario AS usuario,
                v.total,
                v.tipo_pago,
                v.monto_pagado
            FROM venta v
            INNER JOIN cliente c ON v.id_cliente = c.id_cliente
            INNER JOIN usuarios u ON v.idusuario = u.idusuario
            WHERE DATE(v.fecha) BETWEEN ? AND ?
            ORDER BY v.fecha DESC
        `;

        const [ventas] = await db.query(sql, [fechaInicio, fechaFin]);

        res.json({
            success: true,
            count: ventas.length,
            data: ventas
        });
    } catch (error) {
        console.error('Error al obtener reporte de ventas:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al generar el reporte",
            error: error.message
        });
    }
};

module.exports = {
    obtenerReporteVentas
};
