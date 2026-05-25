const pool = require('../config/database');

const obtenerStock = async () => {
  const query = `
    SELECT 
      id,
      codigo,
      nombre,
      categoria,
      talla,
      color,
      stock_actual,
      stock_minimo,
      estado
    FROM vista_productos
    WHERE estado = TRUE
    ORDER BY stock_actual ASC
  `;

  return await pool.query(query);
};

const obtenerBajoStock = async () => {
  const query = `
    SELECT *
    FROM vista_bajo_stock
    ORDER BY stock_actual ASC
  `;

  return await pool.query(query);
};

module.exports = {
  obtenerStock,
  obtenerBajoStock
};