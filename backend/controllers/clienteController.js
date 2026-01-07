const db = require('../config/database');

/**
 * Obtener todos los clientes
 * GET /api/clientes
 */
const obtenerClientes = async (req, res) => {
    try {
        const sql = `
            SELECT 
                id_cliente, 
                nombreC, 
                apellido, 
                dni, 
                telefono, 
                direccion
            FROM cliente 
            ORDER BY id_cliente DESC
        `;
        const [clientes] = await db.query(sql);

        res.json({
            success: true,
            count: clientes.length,
            data: clientes
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los clientes",
            error: error.message
        });
    }
};

/**
 * Obtener cliente por ID
 * GET /api/clientes/:id
 */
const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                id_cliente, 
                nombreC, 
                apellido, 
                dni, 
                telefono, 
                direccion
            FROM cliente 
            WHERE id_cliente = ?
        `;
        const [cliente] = await db.query(sql, [id]);

        if (cliente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cliente no encontrado"
            });
        }

        res.json({
            success: true,
            data: cliente[0]
        });
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el cliente",
            error: error.message
        });
    }
};

/**
 * Crear cliente
 * POST /api/clientes
 */
const crearCliente = async (req, res) => {
    try {
        const { nombreC, apellido, dni, telefono, direccion } = req.body;

        if (!nombreC || !apellido || !dni) {
            return res.status(400).json({
                success: false,
                mensaje: "Nombre, apellido y DNI son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO cliente (nombreC, apellido, dni, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombreC, apellido, dni, telefono, direccion]
        );

        res.status(201).json({
            success: true,
            mensaje: "Cliente creado exitosamente",
            data: {
                id_cliente: resultado.insertId,
                nombreC, apellido, dni, telefono, direccion
            }
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el cliente",
            error: error.message
        });
    }
};

/**
 * Actualizar cliente
 * PUT /api/clientes/:id
 */
const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreC, apellido, dni, telefono, direccion } = req.body;

        const [existente] = await db.query('SELECT id_cliente FROM cliente WHERE id_cliente = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cliente no encontrado"
            });
        }

        await db.query(
            'UPDATE cliente SET nombreC = ?, apellido = ?, dni = ?, telefono = ?, direccion = ? WHERE id_cliente = ?',
            [nombreC, apellido, dni, telefono, direccion, id]
        );

        res.json({
            success: true,
            mensaje: "Cliente actualizado exitosamente",
            data: {
                id_cliente: id,
                nombreC, apellido, dni, telefono, correo, direccion, estado
            }
        });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el cliente",
            error: error.message
        });
    }
};

/**
 * Eliminar cliente
 * DELETE /api/clientes/:id
 */
const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_cliente FROM cliente WHERE id_cliente = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cliente no encontrado"
            });
        }

        await db.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);

        res.json({
            success: true,
            mensaje: "Cliente eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el cliente",
            error: error.message
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};
