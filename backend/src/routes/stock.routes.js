const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

const {
  listarStock,
  listarBajoStock
} = require('../controllers/stock.controller');

router.get('/', verificarToken, listarStock);

router.get('/bajo-stock', verificarToken, listarBajoStock);

module.exports = router;