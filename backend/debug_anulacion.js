const db = require('./config/database');

async function debugCompra(id) {
    if (!id) {
        console.log("Por favor proporciona un ID de compra. Ejemplo: node debug_anulacion.js 5");
        process.exit(1);
    }

    console.log(`=== DIAGNÓSTICO PARA COMPRA ID: ${id} ===`);

    try {
        // 1. Ver Compra
        const [compra] = await db.query('SELECT * FROM compra WHERE id_compra = ?', [id]);
        if (compra.length === 0) {
            console.log("❌ La compra NO existe.");
            process.exit();
        }
        console.log("✅ Compra encontrada:", compra[0]);

        // 2. Ver Detalles
        const [detalles] = await db.query('SELECT * FROM compra_detalle WHERE id_compra = ?', [id]);
        console.log(`🔍 Detalles encontrados: ${detalles.length}`);

        if (detalles.length === 0) {
            console.log("⚠️ ALERTA: La compra no tiene detalles. Por eso el stock no baja.");
        } else {
            console.table(detalles);
        }

        // 3. Ver Stock de los productos involucrados
        for (const d of detalles) {
            const [prod] = await db.query('SELECT id_producto, nombre, stock FROM producto WHERE id_producto = ?', [d.id_producto]);
            if (prod.length > 0) {
                console.log(`📦 Producto ID ${d.id_producto} (${prod[0].nombre}) - Stock Actual: ${prod[0].stock}`);
                console.log(`   -> Cantidad en Compra: ${d.cantidad}`);
                console.log(`   -> Si anulas, debería quedar en: ${prod[0].stock - d.cantidad}`);
            } else {
                console.log(`❌ Producto ID ${d.id_producto} NO encontrado en tabla producto.`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

const idArg = process.argv[2];
debugCompra(idArg);
