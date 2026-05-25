import { useEffect, useState } from 'react';
import api from '../api/axios';

function Movimientos() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esVendedor = usuario?.rol === 'VENDEDOR';

  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  const [form, setForm] = useState({
    tipo: esVendedor ? 'SALIDA' : 'ENTRADA',
    producto_id: '',
    cantidad: '',
    precio_unitario: '',
    observacion: ''
  });

  const obtenerDatos = async () => {
    try {
      const [movRes, prodRes] = await Promise.all([
        api.get('/movimientos'),
        api.get('/productos')
      ]);

      setMovimientos(movRes.data.data);
      setProductos(prodRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const productoSeleccionado = productos.find(
    (producto) => String(producto.id) === String(form.producto_id)
  );

  const movimientosFiltrados = movimientos.filter((mov) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      mov.producto?.toLowerCase().includes(texto) ||
      mov.tipo?.toLowerCase().includes(texto) ||
      mov.usuario?.toLowerCase().includes(texto);

    const coincideTipo =
      filtroTipo === 'TODOS' || mov.tipo === filtroTipo;

    return coincideBusqueda && coincideTipo;
  });

  const totalEntradas = movimientos.filter((mov) => mov.tipo === 'ENTRADA').length;
  const totalSalidas = movimientos.filter((mov) => mov.tipo === 'SALIDA').length;

  const limpiarFormulario = () => {
    setForm({
      tipo: esVendedor ? 'SALIDA' : 'ENTRADA',
      producto_id: '',
      cantidad: '',
      precio_unitario: '',
      observacion: ''
    });
  };

  const abrirModal = () => {
    limpiarFormulario();
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    limpiarFormulario();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'producto_id') {
      const producto = productos.find(
        (item) => String(item.id) === String(value)
      );

      setForm({
        ...form,
        producto_id: value,
        precio_unitario:
          form.tipo === 'SALIDA'
            ? producto?.precio_venta || ''
            : producto?.precio_compra || ''
      });

      return;
    }

    if (name === 'tipo') {
      if (esVendedor && value !== 'SALIDA') {
        return;
      }

      setForm({
        ...form,
        tipo: value,
        precio_unitario: productoSeleccionado
          ? value === 'SALIDA'
            ? productoSeleccionado.precio_venta
            : productoSeleccionado.precio_compra
          : ''
      });

      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const registrarMovimiento = async (e) => {
    e.preventDefault();

    const productoActual = productos.find(
      (producto) => String(producto.id) === String(form.producto_id)
    );

    if (!usuario?.id) {
      alert('No se encontró el usuario autenticado.');
      return;
    }

    if (esVendedor && form.tipo !== 'SALIDA') {
      alert('El vendedor solo puede registrar salidas.');
      return;
    }

    if (!productoActual) {
      alert('Seleccione un producto.');
      return;
    }

    if (Number(form.cantidad) <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    if (Number(form.precio_unitario) < 0) {
      alert('El precio unitario no puede ser negativo.');
      return;
    }

    if (
      form.tipo === 'SALIDA' &&
      Number(form.cantidad) > Number(productoActual.stock_actual)
    ) {
      alert(`No hay stock suficiente. Stock disponible: ${productoActual.stock_actual}`);
      return;
    }

    try {
      await api.post('/movimientos', {
        tipo: form.tipo,
        usuario_id: usuario.id,
        observacion: form.observacion,
        detalles: [
          {
            producto_id: Number(form.producto_id),
            cantidad: Number(form.cantidad),
            precio_unitario: Number(form.precio_unitario)
          }
        ]
      });

      cerrarModal();
      obtenerDatos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar movimiento');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-500">
        Cargando movimientos...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Movimientos
          </h1>

          <p className="text-slate-500 mt-1">
            Entradas y salidas de productos
          </p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800"
        >
          Nuevo movimiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">Total movimientos</p>
          <h2 className="text-3xl font-bold mt-2">{movimientos.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">Entradas</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">{totalEntradas}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">Salidas</p>
          <h2 className="text-3xl font-bold mt-2 text-red-600">{totalSalidas}</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por producto, tipo o usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border border-slate-300 p-3 rounded-xl"
        >
          <option value="TODOS">Todos</option>
          <option value="ENTRADA">Entradas</option>
          <option value="SALIDA">Salidas</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Tipo</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Cantidad</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4">Subtotal</th>
                <th className="text-left p-4">Usuario</th>
                <th className="text-left p-4">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {movimientosFiltrados.map((mov, index) => (
                <tr key={index} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        mov.tipo === 'ENTRADA'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {mov.tipo}
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold">{mov.producto}</p>
                    <p className="text-sm text-slate-500">
                      {mov.color} · {mov.talla}
                    </p>
                  </td>

                  <td className="p-4">{mov.cantidad}</td>

                  <td className="p-4">
                    S/ {Number(mov.precio_unitario).toFixed(2)}
                  </td>

                  <td className="p-4">
                    S/ {Number(mov.subtotal).toFixed(2)}
                  </td>

                  <td className="p-4">{mov.usuario}</td>

                  <td className="p-4">
                    {new Date(mov.created_at).toLocaleDateString('es-PE')}
                  </td>
                </tr>
              ))}

              {movimientosFiltrados.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan="7">
                    No se encontraron movimientos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
            <h2 className="text-2xl font-bold mb-5">
              Nuevo movimiento
            </h2>

            <form onSubmit={registrarMovimiento} className="space-y-4">
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                disabled={esVendedor}
              >
                {!esVendedor && (
                  <option value="ENTRADA">Entrada</option>
                )}

                <option value="SALIDA">Salida</option>
              </select>

              {esVendedor && (
                <p className="text-sm text-slate-500">
                  Tu rol de vendedor solo permite registrar salidas.
                </p>
              )}

              <select
                name="producto_id"
                value={form.producto_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              >
                <option value="">Seleccione producto</option>

                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.codigo} - {producto.nombre} ({producto.color}, {producto.talla}) | Stock: {producto.stock_actual}
                  </option>
                ))}
              </select>

              {productoSeleccionado && (
                <div className="bg-slate-100 rounded-xl p-3 text-sm text-slate-600">
                  <p>
                    Stock disponible:{' '}
                    <strong>{productoSeleccionado.stock_actual}</strong>
                  </p>

                  <p>
                    Precio compra: S/ {productoSeleccionado.precio_compra}
                  </p>

                  <p>
                    Precio venta: S/ {productoSeleccionado.precio_venta}
                  </p>
                </div>
              )}

              <input
                type="number"
                name="cantidad"
                min="1"
                placeholder="Cantidad"
                value={form.cantidad}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              />

              <input
                type="number"
                step="0.01"
                min="0"
                name="precio_unitario"
                placeholder="Precio unitario"
                value={form.precio_unitario}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
                required
              />

              <textarea
                name="observacion"
                placeholder="Observación"
                value={form.observacion}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <div className="flex justify-end gap-3">
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
                  Guardar movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movimientos;