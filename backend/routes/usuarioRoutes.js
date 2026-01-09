const express = require('express');
const router = express.Router();
const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarioController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas protegidas 
router.get('/', verificarToken, verificarAdmin, obtenerUsuarios);
router.get('/:id', verificarToken, verificarAdmin, obtenerUsuarioPorId);
router.post('/', verificarToken, verificarAdmin, crearUsuario);
router.put('/:id', verificarToken, verificarAdmin, actualizarUsuario);
router.delete('/:id', verificarToken, verificarAdmin, eliminarUsuario);

module.exports = router;
