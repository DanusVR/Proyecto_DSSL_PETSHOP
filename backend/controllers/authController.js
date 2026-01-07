const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Registrar nuevo usuario
 * POST /api/auth/registro
 */
const registrarUsuario = async (req, res) => {
    try {
        // Validar errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errores: errors.array()
            });
        }

        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya existe
        const [usuarioExistente] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarioExistente.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El email ya está registrado'
            });
        }

        // Hashear password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar usuario
        // Schema Adaptation: nombre -> nombre_usuario, nombre_completo (using nombre for both usually, or split)
        // Schema: usuarios (idusuario, nombre_usuario, password, nombre_completo, email, rol, estado)
        const [resultado] = await db.query(
            'INSERT INTO usuarios (nombre_usuario, nombre_completo, email, password, rol, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, nombre, email, passwordHash, rol || 'USUARIO', 'ACTIVO']
        );

        res.status(201).json({
            success: true,
            mensaje: 'Usuario registrado exitosamente',
            data: {
                id: resultado.insertId,
                nombre,
                email,
                rol: rol || 'USUARIO'
            }
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar usuario',
            error: error.message
        });
    }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { nombre_usuario, password } = req.body;

        if (!nombre_usuario || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Usuario y password son obligatorios'
            });
        }

        // Buscar usuario
        // Schema Adaptation: activo = 1 -> estado = 'ACTIVO'
        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE nombre_usuario = ? AND estado = ?',
            [nombre_usuario, 'ACTIVO']
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales inválidas'
            });
        }

        const usuario = usuarios[0];
        let passwordValido = false;

        // Hybrid Auth Check: Try bcrypt, if fail, try MD5 (Legacy)
        // Note: bcrypt.compare() usually handles non-bcrypt strings gracefully (returns false) or throws error.
        try {
            passwordValido = await bcrypt.compare(password, usuario.password);
        } catch (e) {
            // Ignore bcrypt error (e.g. invalid salt) and check MD5
        }

        if (!passwordValido) {
            // Check Legacy MD5
            const crypto = require('crypto');
            const md5Hash = crypto.createHash('md5').update(password).digest('hex');
            if (md5Hash === usuario.password) {
                passwordValido = true;

                // Optional: Upgrade password to bcrypt on successful legacy login
                // const salt = await bcrypt.genSalt(10);
                // const newHash = await bcrypt.hash(password, salt);
                // await db.query('UPDATE usuarios SET password = ? WHERE idusuario = ?', [newHash, usuario.idusuario]);
            }
        }

        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales inválidas'
            });
        }

        // Schema Adaptation: No 'ultima_conexion' column in provided schema. Skipping update.
        // await db.query('UPDATE usuarios SET ultima_conexion = CURRENT_TIMESTAMP WHERE id = ?', [usuario.id]);

        const token = jwt.sign(
            {
                id: usuario.idusuario,
                email: usuario.email,
                nombre: usuario.nombre_usuario,
                rol: usuario.rol
            },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        res.json({
            success: true,
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.idusuario,
                nombre: usuario.nombre_usuario,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/perfil
 */
const obtenerPerfil = async (req, res) => {
    try {
        // Schema Adaptation: id -> idusuario, no ultima_conexion
        const [usuarios] = await db.query(
            'SELECT idusuario, nombre_usuario, nombre_completo, email, rol, fecha_creacion, estado FROM usuarios WHERE idusuario = ?',
            [req.usuario.id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuarios[0]
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener perfil',
            error: error.message
        });
    }
};

/**
 * Verificar token (renovación)
 * GET /api/auth/verificar
 */
const verificarToken = (req, res) => {
    res.json({
        success: true,
        mensaje: 'Token válido',
        usuario: req.usuario
    });
};

module.exports = {
    registrarUsuario,
    login,
    obtenerPerfil,
    verificarToken
};
