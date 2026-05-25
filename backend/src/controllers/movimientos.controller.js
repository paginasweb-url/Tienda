const movimientosService = require('../services/movimientos.service');

const crearMovimiento = async (req, res) => {
  try {
    if (req.usuario.rol === 'VENDEDOR' && req.body.tipo !== 'SALIDA') {
      return res.status(403).json({
        success: false,
        message: 'El vendedor solo puede registrar salidas'
      });
    }

    const result = await movimientosService
      .registrarMovimiento(req.body);

    res.status(201).json({
      success: true,
      message: 'Movimiento registrado correctamente',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar movimiento',
      error: error.message
    });
  }
};

const listarMovimientos = async (req, res) => {
  try {

    const result = await movimientosService
      .obtenerMovimientos();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error al listar movimientos',
      error: error.message
    });

  }
};

module.exports = {
  crearMovimiento,
  listarMovimientos
};