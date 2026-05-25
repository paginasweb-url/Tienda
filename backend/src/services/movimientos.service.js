const pool = require('../config/database');

const registrarMovimiento = async (movimiento) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      tipo,
      usuario_id,
      observacion,
      detalles
    } = movimiento;

    const movimientoQuery = `
      INSERT INTO movimientos (
        tipo,
        usuario_id,
        observacion
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const movimientoResult = await client.query(
      movimientoQuery,
      [tipo, usuario_id, observacion]
    );

    const movimientoId = movimientoResult.rows[0].id;

    for (const item of detalles) {

      const detalleQuery = `
        INSERT INTO movimientos_detalle (
          movimiento_id,
          producto_id,
          cantidad,
          precio_unitario
        )
        VALUES ($1, $2, $3, $4)
      `;

      await client.query(detalleQuery, [
        movimientoId,
        item.producto_id,
        item.cantidad,
        item.precio_unitario
      ]);
    }

    await client.query('COMMIT');

    return movimientoResult.rows[0];

  } catch (error) {

    await client.query('ROLLBACK');
    throw error;

  } finally {

    client.release();

  }
};

const obtenerMovimientos = async () => {
  const query = `
    SELECT *
    FROM vista_movimientos
    ORDER BY created_at DESC
  `;

  return await pool.query(query);
};

module.exports = {
  registrarMovimiento,
  obtenerMovimientos
};