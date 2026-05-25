import { useEffect, useState } from 'react';
import api from '../api/axios';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [imagen, setImagen] = useState(null);

  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    talla: '',
    color: '',
    precio_compra: '',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: '',
    imagen_url: ''
  });

  const obtenerProductos = async () => {
    try {
      const { data } = await api.get('/productos');
      setProductos(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();

    return (
      producto.nombre?.toLowerCase().includes(texto) ||
      producto.codigo?.toLowerCase().includes(texto) ||
      producto.categoria?.toLowerCase().includes(texto)
    );
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setForm({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria_id: '',
      talla: '',
      color: '',
      precio_compra: '',
      precio_venta: '',
      stock_actual: '',
      stock_minimo: '',
      imagen_url: ''
    });

    setImagen(null);
    setEditando(null);
  };

  const abrirNuevo = () => {
    limpiarFormulario();
    setModal(true);
  };

  const abrirEditar = (producto) => {
    setEditando(producto.id);

    setForm({
      codigo: producto.codigo || '',
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      categoria_id: producto.categoria_id || '',
      talla: producto.talla || '',
      color: producto.color || '',
      precio_compra: producto.precio_compra || '',
      precio_venta: producto.precio_venta || '',
      stock_actual: producto.stock_actual || '',
      stock_minimo: producto.stock_minimo || '',
      imagen_url: producto.imagen_url || ''
    });

    setImagen(null);
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    limpiarFormulario();
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imagen) {
        formData.append('imagen', imagen);
      }

      if (editando) {
        await api.put(`/productos/${editando}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/productos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      cerrarModal();
      obtenerProductos();

    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar producto');
      console.error(error);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = confirm('¿Deseas eliminar este producto definitivamente?');

    if (!confirmar) return;

    try {
      await api.delete(`/productos/${id}`);
      obtenerProductos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar producto');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-500">
        Cargando productos...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Productos
          </h1>

          <p className="text-slate-500 mt-1">
            Gestión de productos de la tienda J&E
          </p>
        </div>

        <button
          onClick={abrirNuevo}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800"
        >
          Nuevo producto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, código o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full mb-5 border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
      />

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Imagen</th>
                <th className="text-left p-4">Código</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <img
                      src={producto.imagen_url || 'https://placehold.co/80x80'}
                      alt={producto.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {producto.codigo}
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-800">
                      {producto.nombre}
                    </p>

                    <p className="text-sm text-slate-500">
                      {producto.color} · {producto.talla}
                    </p>
                  </td>

                  <td className="p-4">
                    {producto.categoria}
                  </td>

                  <td className="p-4">
                    S/ {producto.precio_venta}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        producto.stock_actual <= producto.stock_minimo
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {producto.stock_actual}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEditar(producto)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {productosFiltrados.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan="7">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5">
              {editando ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <form onSubmit={guardarProducto} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="codigo"
                placeholder="Código"
                value={form.codigo}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              />

              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              />

              <input
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                className="border p-3 rounded-xl md:col-span-2"
              />

              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              >
                <option value="">Categoría</option>
                <option value="1">Polos</option>
                <option value="2">Pantalones</option>
                <option value="3">Casacas</option>
                <option value="4">Vestidos</option>
                <option value="5">Zapatillas</option>
                <option value="6">Accesorios</option>
              </select>

              <input
                name="talla"
                placeholder="Talla"
                value={form.talla}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              />

              <input
                name="color"
                placeholder="Color"
                value={form.color}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              />

              <input
                type="number"
                step="0.01"
                name="precio_compra"
                placeholder="Precio compra"
                value={form.precio_compra}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              />

              <input
                type="number"
                step="0.01"
                name="precio_venta"
                placeholder="Precio venta"
                value={form.precio_venta}
                onChange={handleChange}
                className="border p-3 rounded-xl"
                required
              />

              <input
                type="number"
                name="stock_actual"
                placeholder="Stock actual"
                value={form.stock_actual}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              />

              <input
                type="number"
                name="stock_minimo"
                placeholder="Stock mínimo"
                value={form.stock_minimo}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              />

              {form.imagen_url && (
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500 mb-2">
                    Imagen actual
                  </p>

                  <img
                    src={form.imagen_url}
                    alt="Imagen actual"
                    className="w-24 h-24 object-cover rounded-xl border"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="border p-3 rounded-xl md:col-span-2"
              />

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                  {editando ? 'Actualizar producto' : 'Guardar producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;