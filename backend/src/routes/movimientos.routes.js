const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');

const {
  crearMovimiento,
  listarMovimientos
} = require('../controllers/movimientos.controller');

router.get(
  '/',
  verificarToken,
  listarMovimientos
);

router.post(
  '/',
  verificarToken,
  verificarRol('ADMIN', 'ALMACENERO', 'VENDEDOR'),
  crearMovimiento
);

module.exports = router;