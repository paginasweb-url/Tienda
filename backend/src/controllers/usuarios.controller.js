const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const listarUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.nombre,
        u.correo,
        u.estado,
        u.rol_id,
        r.nombre AS rol,
        u.created_at
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar usuarios',
      error: error.message
    });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol_id } = req.body;

    if (!nombre || !correo || !password || !rol_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios (nombre, correo, password, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, correo, rol_id, estado, created_at
    `;

    const result = await pool.query(query, [
      nombre,
      correo,
      passwordHash,
      rol_id
    ]);

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, password, rol_id, estado } = req.body;

    if (!nombre || !correo || !rol_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo y rol son obligatorios'
      });
    }

    let query;
    let values;

    if (password && password.trim() !== '') {
      const passwordHash = await bcrypt.hash(password, 10);

      query = `
        UPDATE usuarios
        SET nombre = $1,
            correo = $2,
            password = $3,
            rol_id = $4,
            estado = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING id, nombre, correo, rol_id, estado, created_at
      `;

      values = [
        nombre,
        correo,
        passwordHash,
        rol_id,
        estado,
        id
      ];

    } else {
      query = `
        UPDATE usuarios
        SET nombre = $1,
            correo = $2,
            rol_id = $3,
            estado = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, nombre, correo, rol_id, estado, created_at
      `;

      values = [
        nombre,
        correo,
        rol_id,
        estado,
        id
      ];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === Number(req.usuario.id)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propio usuario'
      });
    }

    const query = `
      DELETE FROM usuarios
      WHERE id = $1
      RETURNING id, nombre, correo
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente de la base de datos',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};