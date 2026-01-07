const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Leer token del header
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            mensaje: 'Acceso denegado. No se proporcionó un token.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.usuario = decoded; // { id, username, rol, ... }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            mensaje: 'Token no válido.'
        });
    }
};

const verificarAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            success: false,
            mensaje: 'Acceso denegado. Se requieren permisos de administrador.'
        });
    }
};

module.exports = {
    verificarToken,
    verificarAdmin
};
