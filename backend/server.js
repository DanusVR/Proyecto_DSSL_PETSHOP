require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const mascotaRoutes = require('./routes/mascotaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const citaRoutes = require('./routes/citaRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const compraRoutes = require('./routes/compraRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const historialRoutes = require('./routes/historialRoutes');
const reportesRoutes = require('./routes/reporteRoutes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        mensaje: "API PETSHOP - CRUD con Autenticación JWT",
        version: "1.0.0",
        endpoints: {
            autenticacion: {
                login: "POST /api/auth/login"
            },
            usuarios: {
                crud: "/api/usuarios"
            },
            clientes: {
                crud: "/api/clientes"
            },
            mascotas: {
                crud: "/api/mascotas"
            },
            productos: {
                crud: "/api/productos"
            },
            categorias: {
                crud: "/api/categorias"
            },
            ventas: {
                nueva: "POST /api/ventas",
                listar: "GET /api/ventas"
            },
            reportes: {
                ventas: "GET /api/reportes/ventas"
            }
        },
        autenticacion: {
            tipo: "Bearer Token (JWT)",
            header: "Authorization: Bearer <token>",
            expiracion: "8 horas"
        }
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        mensaje: "Ruta no encontrada"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════');
    console.log('Servidor PETSHOP inicializado correctamente');
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Base de datos: ${process.env.DB_NAME || 'petshop_bd'}`);
    console.log(`JWT configurado - Expiración: ${process.env.JWT_EXPIRE || '8h'}`);
    console.log('═══════════════════════════════════════════');
});
