const db = require('../config/database');

/**
 * Obtener estadísticas del dashboard
 * GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        // 1. Ventas de hoy
        const [ventasHoy] = await db.query(
            "SELECT COALESCE(SUM(total), 0) as total FROM venta WHERE DATE(fecha) = CURDATE()"
        );

        // 2. Citas pendientes     
        const [citasPendientes] = await db.query(
            "SELECT COUNT(*) as total FROM cita WHERE estado = 'Pendiente' OR estado = 'PENDIENTE'"
        );

        // 3. Productos bajo stock (< 5)
        const [productosBajoStock] = await db.query(
            "SELECT id_producto, nombre, stock FROM producto WHERE stock < 5"
        );

        // 4. Nuevos Clientes       
        const [totalClientes] = await db.query("SELECT COUNT(*) as total FROM cliente");

        res.json({
            success: true,
            data: {
                ventasHoy: ventasHoy[0].total,
                citasPendientes: citasPendientes[0].total,
                productosBajoStock: productosBajoStock, 
                productosBajoStockCount: productosBajoStock.length,
                nuevosClientes: 0, 
                totalClientes: totalClientes[0].total
            }
        });
    } catch (error) {
        console.error('Error al obtener dashboard stats:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener estadísticas",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};
