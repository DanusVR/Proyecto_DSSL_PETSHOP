const express = require('express');
const router = express.Router();
const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clienteController');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);

// Rutas protegidas (Usuario y Admin)
router.post('/', verificarToken, crearCliente);
router.put('/:id', verificarToken, actualizarCliente);

// Rutas Admin
router.delete('/:id', verificarToken, verificarAdmin, eliminarCliente);

module.exports = router;
