const db = require('../config/database');

/**
 * Obtener todo el historial (con nombre de mascota)
 * GET /api/historial
 */
const obtenerHistorial = async (req, res) => {
    try {
        const sql = `
            SELECT 
                h.id_historial, 
                h.id_mascota, 
                h.fecha, 
                h.descripcion,
                m.nombre_mascota
            FROM historial_medico h
            INNER JOIN mascota m ON h.id_mascota = m.id_mascota
            ORDER BY h.id_historial DESC
        `;
        const [historial] = await db.query(sql);

        res.json({
            success: true,
            count: historial.length,
            data: historial
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el historial",
            error: error.message
        });
    }
};

/**
 * Obtener historial por mascota
 * GET /api/historial/mascota/:idMascota
 */
const obtenerHistorialPorMascota = async (req, res) => {
    try {
        const { idMascota } = req.params;
        const [historial] = await db.query(
            'SELECT id_historial, id_mascota, fecha, descripcion FROM historial_medico WHERE id_mascota = ? ORDER BY fecha DESC',
            [idMascota]
        );

        res.json({
            success: true,
            count: historial.length,
            data: historial
        });
    } catch (error) {
        console.error('Error al obtener historial por mascota:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el historial de la mascota",
            error: error.message
        });
    }
};

/**
 * Obtener historial por ID (con nombre de mascota)
 * GET /api/historial/:id
 */
const obtenerHistorialPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                h.id_historial, 
                h.id_mascota, 
                h.fecha, 
                h.descripcion,
                m.nombre_mascota
            FROM historial_medico h
            INNER JOIN mascota m ON h.id_mascota = m.id_mascota
            WHERE h.id_historial = ?
        `;
        const [item] = await db.query(sql, [id]);

        if (item.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Registro de historial no encontrado"
            });
        }

        res.json({
            success: true,
            data: item[0]
        });
    } catch (error) {
        console.error('Error al obtener historial por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el registro de historial",
            error: error.message
        });
    }
};

/**
 * Crear historial
 * POST /api/historial
 */
const crearHistorial = async (req, res) => {
    try {
        const { id_mascota, fecha, descripcion } = req.body;

        if (!id_mascota || !fecha) {
            return res.status(400).json({
                success: false,
                mensaje: "Mascota y fecha son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO historial_medico (id_mascota, fecha, descripcion) VALUES (?, ?, ?)',
            [id_mascota, fecha, descripcion]
        );

        res.status(201).json({
            success: true,
            mensaje: "Historial creado exitosamente",
            data: {
                id_historial: resultado.insertId,
                id_mascota, fecha, descripcion
            }
        });
    } catch (error) {
        console.error('Error al crear historial:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el historial",
            error: error.message
        });
    }
};

/**
 * Actualizar historial
 * PUT /api/historial/:id
 */
const actualizarHistorial = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_mascota, fecha, descripcion } = req.body;

        const [existente] = await db.query('SELECT id_historial FROM historial_medico WHERE id_historial = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Registro de historial no encontrado"
            });
        }

        await db.query(
            'UPDATE historial_medico SET id_mascota = ?, fecha = ?, descripcion = ? WHERE id_historial = ?',
            [id_mascota, fecha, descripcion, id]
        );

        res.json({
            success: true,
            mensaje: "Historial actualizado exitosamente",
            data: {
                id_historial: id,
                id_mascota, fecha, descripcion
            }
        });
    } catch (error) {
        console.error('Error al actualizar historial:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el historial",
            error: error.message
        });
    }
};

/**
 * Eliminar historial
 * DELETE /api/historial/:id
 */
const eliminarHistorial = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_historial FROM historial_medico WHERE id_historial = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Registro de historial no encontrado"
            });
        }

        await db.query('DELETE FROM historial_medico WHERE id_historial = ?', [id]);

        res.json({
            success: true,
            mensaje: "Historial eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar historial:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el historial",
            error: error.message
        });
    }
};

module.exports = {
    obtenerHistorial,
    obtenerHistorialPorMascota,
    obtenerHistorialPorId,
    crearHistorial,
    actualizarHistorial,
    eliminarHistorial
};
