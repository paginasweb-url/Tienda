const productosService = require('../services/productos.service');
const supabaseStorage = require('../config/supabaseStorage');

const listarProductos = async (req, res) => {
  try {
    const result = await productosService.obtenerProductos();

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar productos',
      error: error.message
    });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productosService.obtenerProductoPorId(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

const crearProducto = async (req, res) => {
  try {
    let imagen_url = null;

    if (req.file) {
      const nombreArchivo = `productos/${Date.now()}-${req.file.originalname}`;

      const { error } = await supabaseStorage.storage
        .from('productos')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al subir imagen',
          error: error.message
        });
      }

      const { data } = supabaseStorage.storage
        .from('productos')
        .getPublicUrl(nombreArchivo);

      imagen_url = data.publicUrl;
    }

    const producto = {
      ...req.body,
      imagen_url
    };

    const result = await productosService.crearProducto(producto);

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    let imagen_url = req.body.imagen_url || null;

    if (req.file) {
      const nombreArchivo = `productos/${Date.now()}-${req.file.originalname}`;

      const { error } = await supabaseStorage.storage
        .from('productos')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al subir imagen',
          error: error.message
        });
      }

      const { data } = supabaseStorage.storage
        .from('productos')
        .getPublicUrl(nombreArchivo);

      imagen_url = data.publicUrl;
    }

    const producto = {
      ...req.body,
      imagen_url
    };

    const result = await productosService.actualizarProducto(id, producto);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productosService.eliminarProducto(id);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto desactivado correctamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};