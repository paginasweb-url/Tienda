const reportesService = require('../services/reportes.service');

const dashboard = async (req, res) => {
  try {
    const result = await reportesService.obtenerDashboard();

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener dashboard',
      error: error.message
    });
  }
};

const reporteProductos = async (req, res) => {
  try {
    const result = await reportesService.obtenerReporteProductos();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte de productos',
      error: error.message
    });
  }
};

const reporteBajoStock = async (req, res) => {
  try {
    const result = await reportesService.obtenerReporteBajoStock();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte de bajo stock',
      error: error.message
    });
  }
};

const reporteMovimientos = async (req, res) => {
  try {
    const result = await reportesService.obtenerReporteMovimientos();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte de movimientos',
      error: error.message
    });
  }
};

module.exports = {
  dashboard,
  reporteProductos,
  reporteBajoStock,
  reporteMovimientos
};