const express = require('express');
const router = express.Router();
const {
    obtenerCitas,
    obtenerCitaPorId,
    crearCita,
    actualizarCita,
    eliminarCita
} = require('../controllers/citaController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerCitas);
router.get('/:id', obtenerCitaPorId);

// Rutas protegidas
router.post('/', verificarToken, crearCita);
router.put('/:id', verificarToken, actualizarCita);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarCita);

module.exports = router;
