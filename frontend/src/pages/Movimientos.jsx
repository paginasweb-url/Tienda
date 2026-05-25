import { useEffect, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  Search,
  Plus,
  RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los movimientos'
      });

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

  const totalEntradas = movimientos.filter(
    (mov) => mov.tipo === 'ENTRADA'
  ).length;

  const totalSalidas = movimientos.filter(
    (mov) => mov.tipo === 'SALIDA'
  ).length;

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
      if (esVendedor && value !== 'SALIDA') return;

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
      Swal.fire({
        icon: 'error',
        title: 'Usuario no encontrado',
        text: 'No se encontró el usuario autenticado.'
      });
      return;
    }

    if (esVendedor && form.tipo !== 'SALIDA') {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'El vendedor solo puede registrar salidas.'
      });
      return;
    }

    if (!productoActual) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto requerido',
        text: 'Seleccione un producto.'
      });
      return;
    }

    if (Number(form.cantidad) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'La cantidad debe ser mayor a 0.'
      });
      return;
    }

    if (Number(form.precio_unitario) < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio inválido',
        text: 'El precio unitario no puede ser negativo.'
      });
      return;
    }

    if (
      form.tipo === 'SALIDA' &&
      Number(form.cantidad) > Number(productoActual.stock_actual)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Stock insuficiente',
        text: `Stock disponible: ${productoActual.stock_actual}`
      });
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

      Swal.fire({
        icon: 'success',
        title: 'Movimiento registrado',
        text: 'El movimiento fue registrado correctamente',
        timer: 1800,
        showConfirmButton: false
      });

      cerrarModal();
      obtenerDatos();

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message ||
          'Error al registrar movimiento'
      });

      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-slate-500" size={36} />
          <p className="mt-3 text-slate-500">
            Cargando movimientos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 mb-8 shadow-xl">
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -top-20 -right-10" />
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -bottom-24 -left-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-5">
          <div>
            <p className="text-slate-300 text-sm uppercase tracking-widest">
              Inventario
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Movimientos
            </h1>

            <p className="text-slate-300 mt-3">
              Registra entradas y salidas de productos en J&E.
            </p>
          </div>

          <button
            onClick={abrirModal}
            className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold hover:bg-slate-100 flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo movimiento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <Boxes className="text-blue-600 mb-3" size={32} />
          <p className="text-slate-500 text-sm">Total movimientos</p>
          <h2 className="text-4xl font-bold mt-2">{movimientos.length}</h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <ArrowDownCircle className="text-green-600 mb-3" size={32} />
          <p className="text-slate-500 text-sm">Entradas</p>
          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {totalEntradas}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <ArrowUpCircle className="text-red-600 mb-3" size={32} />
          <p className="text-slate-500 text-sm">Salidas</p>
          <h2 className="text-4xl font-bold mt-2 text-red-600">
            {totalSalidas}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />

            <input
              type="text"
              placeholder="Buscar por producto, tipo o usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border border-slate-300 p-3 rounded-2xl"
          >
            <option value="TODOS">Todos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SALIDA">Salidas</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
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
                    <p className="font-semibold text-slate-800">
                      {mov.producto}
                    </p>
                    <p className="text-sm text-slate-500">
                      {mov.color} · {mov.talla}
                    </p>
                  </td>

                  <td className="p-4 font-semibold">
                    {mov.cantidad}
                  </td>

                  <td className="p-4">
                    S/ {Number(mov.precio_unitario).toFixed(2)}
                  </td>

                  <td className="p-4 font-semibold">
                    S/ {Number(mov.subtotal).toFixed(2)}
                  </td>

                  <td className="p-4">
                    {mov.usuario}
                  </td>

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
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-6">
            <h2 className="text-2xl font-bold mb-5 text-slate-800">
              Nuevo movimiento
            </h2>

            <form onSubmit={registrarMovimiento} className="space-y-4">
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border p-3 rounded-2xl"
                disabled={esVendedor}
              >
                {!esVendedor && (
                  <option value="ENTRADA">Entrada</option>
                )}
                <option value="SALIDA">Salida</option>
              </select>

              {esVendedor && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm p-3 rounded-2xl">
                  Tu rol de vendedor solo permite registrar salidas.
                </div>
              )}

              <select
                name="producto_id"
                value={form.producto_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-2xl"
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
                <div className="bg-slate-100 rounded-2xl p-4 text-sm text-slate-600">
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
                className="w-full border p-3 rounded-2xl"
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
                className="w-full border p-3 rounded-2xl"
                required
              />

              <textarea
                name="observacion"
                placeholder="Observación"
                value={form.observacion}
                onChange={handleChange}
                className="w-full border p-3 rounded-2xl"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-3 rounded-2xl border"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
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