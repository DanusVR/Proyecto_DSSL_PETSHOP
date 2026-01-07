const express = require('express');
const router = express.Router();
const {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta
} = require('../controllers/ventaController');
const { verificarToken } = require('../middleware/auth.middleware');

// Rutas protegidas
router.get('/', verificarToken, obtenerVentas);
router.get('/:id', verificarToken, obtenerVentaPorId);
router.post('/', verificarToken, crearVenta);

module.exports = router;
