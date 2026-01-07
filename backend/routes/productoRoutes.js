const express = require('express');
const router = express.Router();
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productoController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarProducto);

module.exports = router;
