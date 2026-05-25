const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

const {
  dashboard,
  reporteProductos,
  reporteBajoStock,
  reporteMovimientos
} = require('../controllers/reportes.controller');

router.get('/dashboard', verificarToken, dashboard);
router.get('/productos', verificarToken, reporteProductos);
router.get('/bajo-stock', verificarToken, reporteBajoStock);
router.get('/movimientos', verificarToken, reporteMovimientos);

module.exports = router;