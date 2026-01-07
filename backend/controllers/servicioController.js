const db = require('../config/database');

/**
 * Obtener todos los servicios
 * GET /api/servicios
 */
const obtenerServicios = async (req, res) => {
    try {
        const sql = `
            SELECT 
                id_servicio, 
                nombre, 
                tipo,
                descripcion, 
                precio, 
                estado 
            FROM servicio 
            ORDER BY id_servicio DESC
        `;
        const [servicios] = await db.query(sql);

        res.json({
            success: true,
            count: servicios.length,
            data: servicios
        });
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los servicios",
            error: error.message
        });
    }
};

/**
 * Obtener servicio por ID
 * GET /api/servicios/:id
 */
const obtenerServicioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                id_servicio, 
                nombre, 
                tipo,
                descripcion, 
                precio, 
                estado 
            FROM servicio 
            WHERE id_servicio = ?
        `;
        const [servicio] = await db.query(sql, [id]);

        if (servicio.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Servicio no encontrado"
            });
        }

        res.json({
            success: true,
            data: servicio[0]
        });
    } catch (error) {
        console.error('Error al obtener servicio por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el servicio",
            error: error.message
        });
    }
};

/**
 * Crear servicio
 * POST /api/servicios
 */
const crearServicio = async (req, res) => {
    try {
        const { nombre, tipo, descripcion, precio, estado } = req.body;

        if (!nombre || !precio || !tipo) {
            return res.status(400).json({
                success: false,
                mensaje: "Nombre, tipo y precio son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO servicio (nombre, tipo, descripcion, precio, estado) VALUES (?, ?, ?, ?, ?)',
            [nombre, tipo, descripcion, precio, estado]
        );

        res.status(201).json({
            success: true,
            mensaje: "Servicio creado exitosamente",
            data: {
                id_servicio: resultado.insertId,
                nombre, tipo, descripcion, precio, estado
            }
        });
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el servicio",
            error: error.message
        });
    }
};

/**
 * Actualizar servicio
 * PUT /api/servicios/:id
 */
const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, descripcion, precio, estado } = req.body;

        const [existente] = await db.query('SELECT id_servicio FROM servicio WHERE id_servicio = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Servicio no encontrado"
            });
        }

        await db.query(
            'UPDATE servicio SET nombre = ?, tipo = ?, descripcion = ?, precio = ?, estado = ? WHERE id_servicio = ?',
            [nombre, tipo, descripcion, precio, estado, id]
        );

        res.json({
            success: true,
            mensaje: "Servicio actualizado exitosamente",
            data: {
                id_servicio: id,
                nombre, descripcion, precio, estado
            }
        });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el servicio",
            error: error.message
        });
    }
};

/**
 * Eliminar servicio
 * DELETE /api/servicios/:id
 */
const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_servicio FROM servicio WHERE id_servicio = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Servicio no encontrado"
            });
        }

        await db.query('DELETE FROM servicio WHERE id_servicio = ?', [id]);

        res.json({
            success: true,
            mensaje: "Servicio eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el servicio",
            error: error.message
        });
    }
};

module.exports = {
    obtenerServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    eliminarServicio
};
