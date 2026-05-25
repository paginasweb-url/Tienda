import { useEffect, useState } from 'react';
import { UserPlus, Users, Shield } from 'lucide-react';
import api from '../api/axios';
import Swal from 'sweetalert2';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol_id: '',
    estado: true
  });

  const obtenerUsuarios = async () => {
    try {
      const { data } = await api.get('/usuarios');
      setUsuarios(data.data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      correo: '',
      password: '',
      rol_id: '',
      estado: true
    });
    setEditando(null);
  };

  const abrirNuevo = () => {
    limpiarFormulario();
    setModal(true);
  };

  const abrirEditar = (usuario) => {
    setEditando(usuario.id);

    setForm({
      nombre: usuario.nombre || '',
      correo: usuario.correo || '',
      password: '',
      rol_id: usuario.rol_id || '',
      estado: usuario.estado
    });

    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    limpiarFormulario();
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/usuarios/${editando}`, form);
      } else {
        await api.post('/usuarios', form);
      }

      cerrarModal();
      obtenerUsuarios();

    } catch (error) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text:
      error.response?.data?.message ||
      'Error al guardar usuario'
  });

  console.error(error);
}
};

const eliminarUsuario = async (id) => {

const result = await Swal.fire({
  title: '¿Eliminar usuario?',
  text: 'Esta acción no se puede deshacer',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#dc2626',
  cancelButtonColor: '#64748b',
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar'
});

if (!result.isConfirmed) return;

try {
  await api.delete(`/usuarios/${id}`);

  Swal.fire({
    icon: 'success',
    title: 'Usuario eliminado',
    text: 'El usuario fue eliminado correctamente'
  });

  obtenerUsuarios();

} catch (error) {

  Swal.fire({
    icon: 'error',
    title: 'Error',
    text:
      error.response?.data?.message ||
      'Error al eliminar usuario'
  });

  console.error(error);
}
};
  if (loading) {
    return (
      <div className="text-center py-10 text-slate-500">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 mb-8 shadow-xl">
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -top-20 -right-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-slate-300 text-sm uppercase tracking-widest">
              Administración
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Usuarios y Roles
            </h1>

            <p className="text-slate-300 mt-3">
              Gestiona los accesos del sistema J&E.
            </p>
          </div>

          <button
            onClick={abrirNuevo}
            className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold hover:bg-slate-100 flex items-center gap-2"
          >
            <UserPlus size={20} />
            Nuevo usuario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <Users className="text-blue-600 mb-3" size={30} />
          <p className="text-slate-500 text-sm">Total usuarios</p>
          <h2 className="text-4xl font-bold mt-2">{usuarios.length}</h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <Shield className="text-purple-600 mb-3" size={30} />
          <p className="text-slate-500 text-sm">Administradores</p>
          <h2 className="text-4xl font-bold mt-2">
            {usuarios.filter((u) => u.rol === 'ADMIN').length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <Shield className="text-green-600 mb-3" size={30} />
          <p className="text-slate-500 text-sm">Usuarios activos</p>
          <h2 className="text-4xl font-bold mt-2">
            {usuarios.filter((u) => u.estado).length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Nombre</th>
                <th className="text-left p-4">Correo</th>
                <th className="text-left p-4">Rol</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-semibold">{usuario.nombre}</td>
                  <td className="p-4">{usuario.correo}</td>

                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                      {usuario.rol}
                    </span>
                  </td>

                  <td className="p-4">
                    {usuario.estado ? (
                      <span className="text-green-600 font-semibold">
                        Activo
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactivo
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {new Date(usuario.created_at).toLocaleDateString('es-PE')}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEditar(usuario)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarUsuario(usuario.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-6">
            <h2 className="text-2xl font-bold mb-5">
              {editando ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>

            <form onSubmit={guardarUsuario} className="space-y-4">
              <input
                name="nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              />

              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={form.correo}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              />

              <input
                type="password"
                name="password"
                placeholder={
                  editando
                    ? 'Nueva contraseña opcional'
                    : 'Contraseña'
                }
                value={form.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required={!editando}
              />

              <select
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              >
                <option value="">Seleccione rol</option>
                <option value="1">ADMIN</option>
                <option value="2">VENDEDOR</option>
                <option value="3">ALMACENERO</option>
              </select>

              {editando && (
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={form.estado}
                    onChange={handleChange}
                  />
                  Usuario activo
                </label>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-3 rounded-xl border"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-slate-900 text-white"
                >
                  {editando ? 'Actualizar usuario' : 'Guardar usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;