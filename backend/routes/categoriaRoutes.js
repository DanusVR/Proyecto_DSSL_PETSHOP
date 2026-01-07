const express = require('express');
const router = express.Router();
const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categoriaController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoriaPorId);

// Rutas protegidas
router.post('/', verificarToken, crearCategoria);
router.put('/:id', verificarToken, actualizarCategoria);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarCategoria);

module.exports = router;
