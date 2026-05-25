const pool = require('../config/database');

const obtenerProductos = async () => {
  const query = `
    SELECT * FROM vista_productos
    ORDER BY id DESC
  `;
  return await pool.query(query);
};

const obtenerProductoPorId = async (id) => {
  const query = `
    SELECT * FROM vista_productos
    WHERE id = $1
  `;
  return await pool.query(query, [id]);
};

const crearProducto = async (producto) => {
  const {
    codigo,
    nombre,
    descripcion,
    categoria_id,
    talla,
    color,
    precio_compra,
    precio_venta,
    stock_actual,
    stock_minimo,
    imagen_url
  } = producto;

  const query = `
    INSERT INTO productos (
      codigo, nombre, descripcion, categoria_id,
      talla, color, precio_compra, precio_venta,
      stock_actual, stock_minimo, imagen_url
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;

  return await pool.query(query, [
    codigo,
    nombre,
    descripcion,
    categoria_id,
    talla,
    color,
    precio_compra,
    precio_venta,
    stock_actual,
    stock_minimo,
    imagen_url
  ]);
};

const actualizarProducto = async (id, producto) => {
  const {
    codigo,
    nombre,
    descripcion,
    categoria_id,
    talla,
    color,
    precio_compra,
    precio_venta,
    stock_minimo,
    imagen_url
  } = producto;

  const query = `
    UPDATE productos
    SET
      codigo = $1,
      nombre = $2,
      descripcion = $3,
      categoria_id = $4,
      talla = $5,
      color = $6,
      precio_compra = $7,
      precio_venta = $8,
      stock_minimo = $9,
      imagen_url = $10,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING *
  `;

  return await pool.query(query, [
    codigo,
    nombre,
    descripcion,
    categoria_id,
    talla,
    color,
    precio_compra,
    precio_venta,
    stock_minimo,
    imagen_url,
    id
  ]);
};

const eliminarProducto = async (id) => {
  const query = `
    DELETE FROM productos
    WHERE id = $1
    RETURNING *
  `;

  return await pool.query(query, [id]);
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};