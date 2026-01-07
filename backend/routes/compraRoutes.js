const express = require('express');
const router = express.Router();
const {
    obtenerCompras,
    obtenerCompraPorId,
    crearCompra,
    anularCompra
} = require('../controllers/compraController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas protegidas
router.get('/', verificarToken, obtenerCompras);
router.get('/:id', verificarToken, obtenerCompraPorId);
router.post('/', verificarToken, crearCompra);

// Anular compra solo Admin
router.put('/:id/anular', verificarToken, verificarAdmin, anularCompra);

module.exports = router;
