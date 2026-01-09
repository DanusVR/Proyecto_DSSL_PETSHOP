const db = require('../config/database');

/**
 * Obtener todos los productos (con nombre de categoria)
 * GET /api/productos
 */
const obtenerProductos = async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.id_producto, 
                p.nombre, 
                p.id_categoria, 
                p.descripcion, 
                p.stock, 
                p.precio_costo, 
                p.precio_venta, 
                p.estado,
                c.nombreCat AS nombre_categoria
            FROM producto p
            INNER JOIN categoria c ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto DESC
        `;
        const [productos] = await db.query(sql);

        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los productos",
            error: error.message
        });
    }
};

/**
 * Obtener producto por ID (con nombre de categoria)
 * GET /api/productos/:id
 */
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                p.id_producto, 
                p.nombre, 
                p.id_categoria, 
                p.descripcion, 
                p.stock, 
                p.precio_costo, 
                p.precio_venta, 
                p.estado,
                c.nombreCat AS nombre_categoria
            FROM producto p
            INNER JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ?
        `;
        const [producto] = await db.query(sql, [id]);

        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            success: true,
            data: producto[0]
        });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el producto",
            error: error.message
        });
    }
};

/**
 * Crear producto
 * POST /api/productos
 */
const crearProducto = async (req, res) => {
    try {
        const { nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado } = req.body;

        if (!nombre || !precio_venta) {
            return res.status(400).json({
                success: false,
                mensaje: "Nombre y precio de venta son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO producto (nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado]
        );

        res.status(201).json({
            success: true,
            mensaje: "Producto creado exitosamente", 
            data: {
                id_producto: resultado.insertId,
                nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado
            }
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el producto",
            error: error.message
        });
    }
};

/**
 * Actualizar producto
 * PUT /api/productos/:id
 */
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado } = req.body;

        const [existente] = await db.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }

        await db.query(
            'UPDATE producto SET nombre = ?, id_categoria = ?, descripcion = ?, stock = ?, precio_costo = ?, precio_venta = ?, estado = ? WHERE id_producto = ?',
            [nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado, id]
        );

        res.json({
            success: true,
            mensaje: "Producto actualizado exitosamente",
            data: {
                id_producto: id,
                nombre, id_categoria, descripcion, stock, precio_costo, precio_venta, estado
            }
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el producto",
            error: error.message
        });
    }
};

/**
 * Eliminar producto
 * DELETE /api/productos/:id
 */
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }

        await db.query('DELETE FROM producto WHERE id_producto = ?', [id]);

        res.json({
            success: true,
            mensaje: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el producto",
            error: error.message
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
