const db = require('../config/database');

/**
 * Obtener todas las ventas (con cliente y usuario)
 * GET /api/ventas
 */
const obtenerVentas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                v.id_venta, 
                v.id_cliente, 
                v.idusuario, 
                v.fecha, 
                v.total, 
                v.tipo_pago, 
                v.monto_pagado,
                c.nombreC AS nombre_cliente,
                c.apellido AS apellido_cliente,
                u.nombre_usuario
            FROM venta v
            INNER JOIN cliente c ON v.id_cliente = c.id_cliente
            INNER JOIN usuarios u ON v.idusuario = u.idusuario
            ORDER BY v.id_venta DESC
        `;
        const [ventas] = await db.query(sql);

        res.json({
            success: true,
            count: ventas.length,
            data: ventas
        });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las ventas",
            error: error.message
        });
    }
};

/**
 * Obtener venta por ID con detalles (y nombres)
 * GET /api/ventas/:id
 */
const obtenerVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener cabecera
        const sqlHeader = `
            SELECT 
                v.id_venta, 
                v.id_cliente, 
                v.idusuario, 
                v.fecha, 
                v.total, 
                v.tipo_pago, 
                v.monto_pagado,
                c.nombreC AS nombre_cliente,
                c.apellido AS apellido_cliente,
                u.nombre_usuario
            FROM venta v
            INNER JOIN cliente c ON v.id_cliente = c.id_cliente
            INNER JOIN usuarios u ON v.idusuario = u.idusuario
            WHERE v.id_venta = ?
        `;
        const [venta] = await db.query(sqlHeader, [id]);

        if (venta.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Venta no encontrada"
            });
        }

        // Obtener detalles con nombres de producto/servicio
        const sqlDetalles = `
            SELECT 
                dv.id_detalle,
                dv.id_venta,
                dv.id_producto,
                dv.id_servicio,
                dv.cantidad,
                dv.precio,
                dv.subtotal,
                p.nombre AS nombre_producto,
                s.nombre AS nombre_servicio
            FROM detalle_venta dv
            LEFT JOIN producto p ON dv.id_producto = p.id_producto
            LEFT JOIN servicio s ON dv.id_servicio = s.id_servicio
            WHERE dv.id_venta = ?
        `;
        const [detalles] = await db.query(sqlDetalles, [id]);

        const data = venta[0];
        data.detalles = detalles;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error al obtener venta por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la venta",
            error: error.message
        });
    }
};

/**
 * Crear nueva venta
 * POST /api/ventas
 */
const crearVenta = async (req, res) => {
    let connection;
    try {
        const { id_cliente, id_usuario, total, tipo_pago, monto_pagado, detalles } = req.body;

        if (!detalles || detalles.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "La venta debe tener al menos un detalle"
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insertar Venta
        const [resultadoVenta] = await connection.query(
            'INSERT INTO venta (id_cliente, idusuario, total, tipo_pago, monto_pagado) VALUES (?, ?, ?, ?, ?)',
            [id_cliente, id_usuario, total, tipo_pago, monto_pagado]
        );

        const id_venta = resultadoVenta.insertId;

        // 2. Insertar Detalles y Actualizar Stock (si es producto)
        for (const item of detalles) {
            await connection.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, id_servicio, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
                [id_venta, item.id_producto || null, item.id_servicio || null, item.cantidad, item.precio, item.subtotal]
            );

            // Si es producto, restar stock
            if (item.id_producto) {
                await connection.query(
                    'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
                    [item.cantidad, item.id_producto]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            mensaje: "Venta registrada exitosamente",
            data: { id_venta }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al registrar venta:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al registrar la venta",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta
};
