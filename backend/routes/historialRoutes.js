const express = require('express');
const router = express.Router();
const {
    obtenerHistorial,
    obtenerHistorialPorMascota,
    obtenerHistorialPorId,
    crearHistorial,
    actualizarHistorial,
    eliminarHistorial
} = require('../controllers/historialController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerHistorial);
router.get('/mascota/:idMascota', obtenerHistorialPorMascota);
router.get('/:id', obtenerHistorialPorId);

// Rutas protegidas
router.post('/', verificarToken, crearHistorial);
router.put('/:id', verificarToken, actualizarHistorial);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarHistorial);

module.exports = router;
