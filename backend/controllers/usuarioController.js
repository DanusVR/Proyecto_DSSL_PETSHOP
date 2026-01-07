const db = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 */
const obtenerUsuarios = async (req, res) => {
    try {
        const sql = `
            SELECT 
                idusuario, 
                nombre_usuario, 
                nombre_completo, 
                email, 
                rol, 
                estado,
                fecha_registro
            FROM usuarios 
            ORDER BY idusuario DESC
        `;
        const [usuarios] = await db.query(sql);

        res.json({
            success: true,
            count: usuarios.length,
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener usuarios",
            error: error.message
        });
    }
};

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:id
 */
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                idusuario, 
                nombre_usuario, 
                nombre_completo, 
                email, 
                rol, 
                estado,
                fecha_registro
            FROM usuarios 
            WHERE idusuario = ?
        `;
        const [usuario] = await db.query(sql, [id]);

        if (usuario.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }

        res.json({
            success: true,
            data: usuario[0]
        });
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener usuario",
            error: error.message
        });
    }
};

/**
 * Crear usuario
 * POST /api/usuarios
 */
const crearUsuario = async (req, res) => {
    try {
        const { nombre_usuario, password, nombre_completo, email, rol, estado } = req.body;

        if (!nombre_usuario || !password || !email) {
            return res.status(400).json({
                success: false,
                mensaje: "Nombre de usuario, contraseña y email son obligatorios"
            });
        }

        // Encriptar password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [resultado] = await db.query(
            'INSERT INTO usuarios (nombre_usuario, password, nombre_completo, email, rol, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_usuario, hashedPassword, nombre_completo, email, rol || 'EMPLEADO', estado || 'ACTIVO']
        );

        res.status(201).json({
            success: true,
            mensaje: "Usuario creado exitosamente",
            data: {
                idusuario: resultado.insertId,
                nombre_usuario, nombre_completo, email, rol, estado
            }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear usuario",
            error: error.message
        });
    }
};

/**
 * Actualizar usuario
 * PUT /api/usuarios/:id
 */
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_usuario, nombre_completo, email, rol, estado } = req.body;

        const [existente] = await db.query('SELECT idusuario FROM usuarios WHERE idusuario = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }

        await db.query(
            'UPDATE usuarios SET nombre_usuario = ?, nombre_completo = ?, email = ?, rol = ?, estado = ? WHERE idusuario = ?',
            [nombre_usuario, nombre_completo, email, rol, estado, id]
        );

        res.json({
            success: true,
            mensaje: "Usuario actualizado exitosamente",
            data: {
                idusuario: id,
                nombre_usuario, nombre_completo, email, rol, estado
            }
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar usuario",
            error: error.message
        });
    }
};

/**
 * Eliminar usuario
 * DELETE /api/usuarios/:id
 */
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT idusuario FROM usuarios WHERE idusuario = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }

        await db.query('DELETE FROM usuarios WHERE idusuario = ?', [id]);

        res.json({
            success: true,
            mensaje: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar usuario",
            error: error.message
        });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
