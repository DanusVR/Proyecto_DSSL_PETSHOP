const db = require('../config/database');

/**
 * Obtener todas las mascotas (con datos del cliente)
 * GET /api/mascotas
 */
const obtenerMascotas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                m.id_mascota, 
                m.id_cliente, 
                m.nombre_mascota, 
                m.especie, 
                m.raza, 
                m.edad, 
                m.sexo,
                c.nombreC AS nombre_cliente,
                c.apellido AS apellido_cliente,
                CONCAT(c.nombreC, ' ', c.apellido) AS cliente_completo
            FROM mascota m
            INNER JOIN cliente c ON m.id_cliente = c.id_cliente
            ORDER BY m.id_mascota DESC
        `;
        const [mascotas] = await db.query(sql);

        res.json({
            success: true,
            count: mascotas.length,
            data: mascotas
        });
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las mascotas",
            error: error.message
        });
    }
};

/**
 * Obtener mascota por ID
 * GET /api/mascotas/:id
 */
const obtenerMascotaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                m.id_mascota, 
                m.id_cliente, 
                m.nombre_mascota, 
                m.especie, 
                m.raza, 
                m.edad, 
                m.sexo,
                c.nombreC AS nombre_cliente,
                c.apellido AS apellido_cliente
            FROM mascota m
            INNER JOIN cliente c ON m.id_cliente = c.id_cliente
            WHERE m.id_mascota = ?
        `;
        const [mascota] = await db.query(sql, [id]);

        if (mascota.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Mascota no encontrada"
            });
        }

        res.json({
            success: true,
            data: mascota[0]
        });
    } catch (error) {
        console.error('Error al obtener mascota por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la mascota",
            error: error.message
        });
    }
};

/**
 * Crear mascota
 * POST /api/mascotas
 */
const crearMascota = async (req, res) => {
    try {
        const { id_cliente, nombre_mascota, especie, raza, edad, sexo } = req.body;

        if (!nombre_mascota || !especie) {
            return res.status(400).json({
                success: false,
                mensaje: "Nombre y especie son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO mascota (id_cliente, nombre_mascota, especie, raza, edad, sexo) VALUES (?, ?, ?, ?, ?, ?)',
            [id_cliente, nombre_mascota, especie, raza, edad, sexo]
        );

        res.status(201).json({
            success: true,
            mensaje: "Mascota creada exitosamente",
            data: {
                id_mascota: resultado.insertId,
                id_cliente, nombre_mascota, especie, raza, edad, sexo
            }
        });
    } catch (error) {
        console.error('Error al crear mascota:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear la mascota",
            error: error.message
        });
    }
};

/**
 * Actualizar mascota
 * PUT /api/mascotas/:id
 */
const actualizarMascota = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_cliente, nombre_mascota, especie, raza, edad, sexo } = req.body;

        const [existente] = await db.query('SELECT id_mascota FROM mascota WHERE id_mascota = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Mascota no encontrada"
            });
        }

        await db.query(
            'UPDATE mascota SET id_cliente = ?, nombre_mascota = ?, especie = ?, raza = ?, edad = ?, sexo = ? WHERE id_mascota = ?',
            [id_cliente, nombre_mascota, especie, raza, edad, sexo, id]
        );

        res.json({
            success: true,
            mensaje: "Mascota actualizada exitosamente",
            data: {
                id_mascota: id,
                id_cliente, nombre_mascota, especie, raza, edad, sexo
            }
        });
    } catch (error) {
        console.error('Error al actualizar mascota:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar la mascota",
            error: error.message
        });
    }
};

/**
 * Eliminar mascota
 * DELETE /api/mascotas/:id
 */
const eliminarMascota = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_mascota FROM mascota WHERE id_mascota = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Mascota no encontrada"
            });
        }

        await db.query('DELETE FROM mascota WHERE id_mascota = ?', [id]);

        res.json({
            success: true,
            mensaje: "Mascota eliminada exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar mascota:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar la mascota",
            error: error.message
        });
    }
};

module.exports = {
    obtenerMascotas,
    obtenerMascotaPorId,
    crearMascota,
    actualizarMascota,
    eliminarMascota
};
