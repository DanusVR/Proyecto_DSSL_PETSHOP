const express = require('express');
const router = express.Router();
const { obtenerReporteVentas } = require('../controllers/reporteController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');


router.get('/ventas', verificarToken, verificarAdmin, obtenerReporteVentas);

module.exports = router;
