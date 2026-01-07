const db = require('../config/database');

/**
 * Obtener todas las categorias
 * GET /api/categorias
 */
const obtenerCategorias = async (req, res) => {
    try {
        const sql = `
            SELECT 
                id_categoria, 
                nombreCat AS nombre, 
                NULL AS descripcion, 
                NULL AS estado 
            FROM categoria 
            ORDER BY id_categoria DESC
        `;
        const [categorias] = await db.query(sql);

        res.json({
            success: true,
            count: categorias.length,
            data: categorias
        });
    } catch (error) {
        console.error('Error al obtener categorias:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las categorias",
            error: error.message
        });
    }
};

/**
 * Obtener categoria por ID
 * GET /api/categorias/:id
 */
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                id_categoria, 
                nombreCat AS nombre, 
                NULL AS descripcion, 
                NULL AS estado 
            FROM categoria 
            WHERE id_categoria = ?
        `;
        const [categoria] = await db.query(sql, [id]);

        if (categoria.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Categoria no encontrada"
            });
        }

        res.json({
            success: true,
            data: categoria[0]
        });
    } catch (error) {
        console.error('Error al obtener categoria por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la categoria",
            error: error.message
        });
    }
};

/**
 * Crear categoria
 * POST /api/categorias
 */
const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                mensaje: "El nombre es obligatorio"
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO categoria (nombreCat) VALUES (?)`,
            [nombre]
        );

        res.status(201).json({
            success: true,
            mensaje: "Categoria creada exitosamente",
            data: {
                id_categoria: resultado.insertId,
                nombre
            }
        });
    } catch (error) {
        console.error('Error al crear categoria:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear la categoria",
            error: error.message
        });
    }
};

/**
 * Actualizar categoria
 * PUT /api/categorias/:id
 */
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const [existente] = await db.query(`SELECT id_categoria 
            FROM categoria WHERE id_categoria = ?`, [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Categoria no encontrada"
            });
        }

        await db.query(`
            UPDATE categoria SET nombreCat = ? WHERE id_categoria = ?`,
            [nombre, id]
        );

        res.json({
            success: true,
            mensaje: "Categoria actualizada exitosamente",
            data: {
                id_categoria: id,
                nombre
            }
        });
    } catch (error) {
        console.error('Error al actualizar categoria:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar la categoria",
            error: error.message
        });
    }
};

/**
 * Eliminar categoria
 * DELETE /api/categorias/:id
 */
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query(`SELECT id_categoria FROM categoria WHERE id_categoria = ?`, [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Categoria no encontrada"
            });
        }

        await db.query(`DELETE FROM categoria WHERE id_categoria = ?`, [id]);

        res.json({
            success: true,
            mensaje: "Categoria eliminada exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar categoria:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar la categoria",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
