const pool = require('../config/database');

const obtenerDashboard = async () => {
  const query = `
    SELECT *
    FROM vista_dashboard
  `;

  return await pool.query(query);
};

const obtenerReporteProductos = async () => {
  const query = `
    SELECT *
    FROM vista_productos
    WHERE estado = TRUE
    ORDER BY nombre ASC
  `;

  return await pool.query(query);
};

const obtenerReporteBajoStock = async () => {
  const query = `
    SELECT *
    FROM vista_bajo_stock
    ORDER BY stock_actual ASC
  `;

  return await pool.query(query);
};

const obtenerReporteMovimientos = async () => {
  const query = `
    SELECT *
    FROM vista_movimientos
    ORDER BY created_at DESC
  `;

  return await pool.query(query);
};

module.exports = {
  obtenerDashboard,
  obtenerReporteProductos,
  obtenerReporteBajoStock,
  obtenerReporteMovimientos
};