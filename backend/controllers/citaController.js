const db = require('../config/database');

/**
 * Obtener todas las citas (con datos de mascota y servicio principal)
 * GET /api/citas
 */
const obtenerCitas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.id_cita, 
                c.id_mascota, 
                c.fecha, 
                c.hora, 
                c.estado, 
                c.observacion,
                m.nombre_mascota,
                (
                    SELECT s.nombre 
                    FROM cita_detalle cd 
                    JOIN servicio s ON cd.id_servicio = s.id_servicio 
                    WHERE cd.id_cita = c.id_cita 
                    LIMIT 1
                ) AS nombre_servicio,
                (SELECT COUNT(*) FROM cita_detalle cd WHERE cd.id_cita = c.id_cita) as cantidad_servicios
            FROM cita c
            INNER JOIN mascota m ON c.id_mascota = m.id_mascota
            ORDER BY c.id_cita DESC
        `;
        const [citas] = await db.query(sql);

        res.json({
            success: true,
            count: citas.length,
            data: citas
        });
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las citas",
            error: error.message
        });
    }
};

/**
 * Obtener cita por ID (con datos de mascota y todos los servicios)
 * GET /api/citas/:id
 */
const obtenerCitaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                c.id_cita, 
                c.id_mascota, 
                c.fecha, 
                c.hora, 
                c.estado, 
                c.observacion,
                m.nombre_mascota,
                (
                    SELECT s.nombre 
                    FROM cita_detalle cd 
                    JOIN servicio s ON cd.id_servicio = s.id_servicio 
                    WHERE cd.id_cita = c.id_cita 
                    LIMIT 1
                ) AS nombre_servicio
            FROM cita c
            INNER JOIN mascota m ON c.id_mascota = m.id_mascota
            WHERE c.id_cita = ?
        `;
        const [cita] = await db.query(sql, [id]);

        if (cita.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cita no encontrada"
            });
        }

        // Obtener detalles (servicios adicionales)
        const sqlDetalles = `
            SELECT 
                cd.id_cita_detalle,
                cd.id_servicio,
                s.nombre AS nombre_servicio,
                s.precio
            FROM cita_detalle cd
            INNER JOIN servicio s ON cd.id_servicio = s.id_servicio
            WHERE cd.id_cita = ?
        `;
        const [detalles] = await db.query(sqlDetalles, [id]);

        const data = cita[0];
        data.servicios = detalles;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error al obtener cita por ID:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la cita",
            error: error.message
        });
    }
};

/**
 * Crear cita (soporta múltiples servicios)
 * POST /api/citas
 */
const crearCita = async (req, res) => {
    let connection;
    try {
        const { id_mascota, servicios, fecha, hora, estado, observacion } = req.body;
        // servicios puede ser un array de IDs de servicios

        if (!id_mascota || !servicios || servicios.length === 0 || !fecha || !hora) {
            return res.status(400).json({
                success: false,
                mensaje: "Mascota, al menos un servicio, fecha y hora son obligatorios"
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();
        // Insertar Cita (sin id_servicio, ya que va en detalle)
        const [resultado] = await connection.query(
            'INSERT INTO cita (id_mascota, fecha, hora, estado, observacion) VALUES (?, ?, ?, ?, ?)',
            [id_mascota, fecha, hora, estado || 'Pendiente', observacion]
        );

        const id_cita = resultado.insertId;

        // Insertar Detalles
        for (const id_servicio of servicios) {
            await connection.query(
                'INSERT INTO cita_detalle (id_cita, id_servicio) VALUES (?, ?)',
                [id_cita, id_servicio]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            mensaje: "Cita creada exitosamente",
            data: {
                id_cita, id_mascota, servicios, fecha, hora, estado, observacion
            }
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al crear cita:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al crear la cita",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Actualizar cita
 * PUT /api/citas/:id
 */
const actualizarCita = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { id_mascota, servicios, fecha, hora, estado, observacion } = req.body;

        connection = await db.getConnection();
        await connection.beginTransaction();

        const [existente] = await connection.query('SELECT id_cita FROM cita WHERE id_cita = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cita no encontrada"
            });
        }

        if (servicios && servicios.length > 0) {
            // Actualizar Cabecera
            await connection.query(
                'UPDATE cita SET id_mascota = ?, fecha = ?, hora = ?, estado = ?, observacion = ? WHERE id_cita = ?',
                [id_mascota, fecha, hora, estado, observacion, id]
            );

            // Eliminar detalles anteriores
            await connection.query('DELETE FROM cita_detalle WHERE id_cita = ?', [id]);

            // Insertar nuevos detalles
            for (const id_servicio of servicios) {
                await connection.query(
                    'INSERT INTO cita_detalle (id_cita, id_servicio) VALUES (?, ?)',
                    [id, id_servicio]
                );
            }
        } else {
          
            await connection.query(
                'UPDATE cita SET id_mascota = ?, fecha = ?, hora = ?, estado = ?, observacion = ? WHERE id_cita = ?',
                [id_mascota, fecha, hora, estado, observacion, id]
            );
        }

        await connection.commit();

        res.json({
            success: true,
            mensaje: "Cita actualizada exitosamente",
            data: {
                id_cita: id,
                id_mascota, servicios, fecha, hora, estado, observacion
            }
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al actualizar cita:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar la cita",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Eliminar cita
 * DELETE /api/citas/:id
 */
const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT id_cita FROM cita WHERE id_cita = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cita no encontrada"
            });
        }

        await db.query('DELETE FROM cita WHERE id_cita = ?', [id]);

        res.json({
            success: true,
            mensaje: "Cita eliminada exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar la cita",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCitas,
    obtenerCitaPorId,
    crearCita,
    actualizarCita,
    eliminarCita
};
