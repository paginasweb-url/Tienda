const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/role.middleware');

const {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios.controller');

router.get(
  '/',
  verificarToken,
  verificarRol('ADMIN'),
  listarUsuarios
);

router.post(
  '/',
  verificarToken,
  verificarRol('ADMIN'),
  crearUsuario
);

router.put(
  '/:id',
  verificarToken,
  verificarRol('ADMIN'),
  actualizarUsuario
);

router.delete(
  '/:id',
  verificarToken,
  verificarRol('ADMIN'),
  eliminarUsuario
);

module.exports = router;