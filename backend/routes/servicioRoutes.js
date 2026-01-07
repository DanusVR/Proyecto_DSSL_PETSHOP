const express = require('express');
const router = express.Router();
const {
    obtenerServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    eliminarServicio
} = require('../controllers/servicioController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerServicios);
router.get('/:id', obtenerServicioPorId);

// Rutas protegidas
router.post('/', verificarToken, crearServicio);
router.put('/:id', verificarToken, actualizarServicio);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarServicio);

module.exports = router;
