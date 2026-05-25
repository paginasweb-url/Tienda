const stockService = require('../services/stock.service');

const listarStock = async (req, res) => {
  try {
    const result = await stockService.obtenerStock();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar stock',
      error: error.message
    });
  }
};

const listarBajoStock = async (req, res) => {
  try {
    const result = await stockService.obtenerBajoStock();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar productos con bajo stock',
      error: error.message
    });
  }
};

module.exports = {
  listarStock,
  listarBajoStock
};