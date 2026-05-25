const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productos.controller');

router.get('/', verificarToken, listarProductos);

router.get('/:id', verificarToken, obtenerProducto);

router.post(
  '/',
  verificarToken,
  verificarRol('ADMIN', 'ALMACENERO'),
  upload.single('imagen'),
  crearProducto
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMIN', 'ALMACENERO'),
  upload.single('imagen'),
  actualizarProducto
);

router.delete(
  '/:id',
  verificarToken,
  verificarRol('ADMIN'),
  eliminarProducto
);

module.exports = router;