const express = require('express');
const router = express.Router();
const {
    obtenerMascotas,
    obtenerMascotaPorId,
    crearMascota,
    actualizarMascota,
    eliminarMascota
} = require('../controllers/mascotaController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerMascotas);
router.get('/:id', obtenerMascotaPorId);

// Rutas protegidas
router.post('/', verificarToken, crearMascota);
router.put('/:id', verificarToken, actualizarMascota);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarMascota);

module.exports = router;
