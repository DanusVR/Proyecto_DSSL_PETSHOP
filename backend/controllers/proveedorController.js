const db = require('../config/database');

/**
 * Obtener todos los proveedores
 * GET /api/proveedores
 */
const obtenerProveedores = async (req, res) => {
    try {
        const sql = `
            SELECT 
                id_proveedor, 
                nombre, 
                ruc, 
                telefono, 
                correo, 
                direccion, 
                tipo, 
                estado 
            FROM proveedor 
            ORDER BY id_proveedor DESC
        `;
        const [proveedores] = await db.query(sql);

        res.json({
            success: true,
            count: proveedores.length,
            data: proveedores
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los proveedores",
            error: error.message
        });
    }
};

/**
 * Obtener proveedor por ID
 * GET /api/proveedores/:id
 */
const obtenerProveedorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                id_proveedor, 
                nombre, 
                ruc, 
                telefono, 
                correo, 
                direccion, 
                tipo, 
                estado 
            FROM proveedor 
            WHERE id_proveedor = ?
        `;
        const [proveedor] = await db.query(sql, [id]);

        if (proveedor.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Proveedor no encontrado"
            });
        }

        res.json({
            success: true,
            data: proveedor[0]
        });
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el proveedor",
            error: error.message
        });
    }
};

/**
 * Crear proveedor
 * POST /api/proveedores
 */
const crearProveedor = async (req, res) => {
    try {
        const { nombre, ruc, telefono, correo, direccion, tipo } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                mensaje: "El nombre es obligatorio"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO proveedor (nombre, ruc, telefono, correo, direccion, tipo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, ruc, telefono, correo, direccion, tipo]
        );

        res.status(201).json({
            success: true,
            mensaje: "Proveedor creado exitosamente",
            data: {
                id_proveedor: resultado.insertId,
                nombre, ruc, telefono, correo, direccion, tipo
            }
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el proveedor",
            error: error.message
        });
    }
};

/**
 * Actualizar proveedor
 * PUT /api/proveedores/:id
 */
const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ruc, telefono, correo, direccion, tipo, estado } = req.body;

        const [existente] = await db.query('SELECT id_proveedor FROM proveedor WHERE id_proveedor = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Proveedor no encontrado"
            });
        }

        await db.query(
            'UPDATE proveedor SET nombre = ?, ruc = ?, telefono = ?, correo = ?, direccion = ?, tipo = ?, estado = ? WHERE id_proveedor = ?',
            [nombre, ruc, telefono, correo, direccion, tipo, estado, id]
        );

        res.json({
            success: true,
            mensaje: "Proveedor actualizado exitosamente",
            data: {
                id_proveedor: id,
                nombre, ruc, telefono, correo, direccion, tipo, estado
            }
        });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el proveedor",
            error: error.message
        });
    }
};

/**
 * Eliminar proveedor
 * DELETE /api/proveedores/:id
 */
const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_proveedor FROM proveedor WHERE id_proveedor = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Proveedor no encontrado"
            });
        }

        await db.query('DELETE FROM proveedor WHERE id_proveedor = ?', [id]);

        res.json({
            success: true,
            mensaje: "Proveedor eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el proveedor",
            error: error.message
        });
    }
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};
