const db = require('../config/database');

/**
 * Obtener todas las compras (con nombre de proveedor)
 * GET /api/compras
 */
const obtenerCompras = async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.id_compra, 
                c.id_proveedor, 
                c.fecha_compra, 
                c.total, 
                c.estado,
                p.nombre AS nombre_proveedor
            FROM compra c
            INNER JOIN proveedor p ON c.id_proveedor = p.id_proveedor
            ORDER BY c.id_compra DESC
        `;
        const [compras] = await db.query(sql);

        res.json({
            success: true,
            count: compras.length,
            data: compras
        });
    } catch (error) {
        console.error('Error al obtener compras:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las compras",
            error: error.message
        });
    }
};

/**
 * Obtener compra por ID con detalles y nombres
 * GET /api/compras/:id
 */
const obtenerCompraPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const sqlHeader = `
            SELECT 
                c.id_compra, 
                c.id_proveedor, 
                c.fecha_compra, 
                c.id_compra, 
                c.id_proveedor, 
                c.fecha_compra, 
                c.total, 
                c.estado,
                p.nombre AS nombre_proveedor
            FROM compra c
            INNER JOIN proveedor p ON c.id_proveedor = p.id_proveedor
            WHERE c.id_compra = ?
        `;
        const [compra] = await db.query(sqlHeader, [id]);

        if (compra.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Compra no encontrada"
            });
        }

        const sqlDetalles = `
            SELECT 
                cd.id_compra_detalle,
                cd.id_compra,
                cd.id_producto,
                cd.cantidad,
                cd.precio_unitario,
                prod.nombre AS nombre_producto
            FROM compra_detalle cd
            INNER JOIN producto prod ON cd.id_producto = prod.id_producto
            WHERE cd.id_compra = ?
        `;
        const [detalles] = await db.query(sqlDetalles, [id]);

        const data = compra[0];
        data.detalles = detalles;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error al obtener compra por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la compra",
            error: error.message
        });
    }
};

/**
 * Crear nueva compra
 * POST /api/compras
 */
const crearCompra = async (req, res) => {
    let connection;
    try {
        const { id_proveedor, total, estado, detalles } = req.body;

        if (!detalles || detalles.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "La compra debe tener al menos un detalle"
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        //  Insertar Compra
        const [resultadoCompra] = await connection.query(
            'INSERT INTO compra (id_proveedor, fecha_compra, total, estado) VALUES (?, NOW(), ?, ?)',
            [id_proveedor, total, estado || 'activo']
        );

        const id_compra = resultadoCompra.insertId;

        //  Insertar Detalles y Actualizar Stock (aumentar)
        for (const item of detalles) {
            await connection.query(
                'INSERT INTO compra_detalle (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [id_compra, item.id_producto, item.cantidad, item.precio_unitario]
            );

            // Aumentar stock
            await connection.query(
                'UPDATE producto SET stock = stock + ? WHERE id_producto = ?',
                [item.cantidad, item.id_producto]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            mensaje: "Compra registrada exitosamente",
            data: { id_compra }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al registrar compra:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al registrar la compra",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Anular compra
 * PUT /api/compras/:id/anular
 */
const anularCompra = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE compra SET estado = ? WHERE id_compra = ?', ['anulado', id]);

        res.json({
            success: true,
            mensaje: "Compra anulada exitosamente"
        });
    } catch (error) {
        console.error('Error al anular compra:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al anular la compra",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCompras,
    obtenerCompraPorId,
    crearCompra,
    anularCompra
};
