const express = require('express');
const router = express.Router();
const {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} = require('../controllers/proveedorController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedorPorId);

// Rutas protegidas
router.post('/', verificarToken, crearProveedor);
router.put('/:id', verificarToken, actualizarProveedor);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarProveedor);

module.exports = router;
