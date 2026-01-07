const express = require('express');
const router = express.Router();
const { obtenerReporteVentas } = require('../controllers/reporteController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas protegidas (Admin only for reports)
router.get('/ventas', verificarToken, verificarAdmin, obtenerReporteVentas);

module.exports = router;
