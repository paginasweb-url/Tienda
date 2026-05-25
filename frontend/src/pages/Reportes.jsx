import { useEffect, useState } from 'react';
import api from '../api/axios';

function Reportes() {
  const [productos, setProductos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [tab, setTab] = useState('productos');
  const [loading, setLoading] = useState(true);

  const obtenerReportes = async () => {
    try {
      const [prodRes, bajoRes, movRes] = await Promise.all([
        api.get('/reportes/productos'),
        api.get('/reportes/bajo-stock'),
        api.get('/reportes/movimientos')
      ]);

      setProductos(prodRes.data.data);
      setBajoStock(bajoRes.data.data);
      setMovimientos(movRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Cargando reportes...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Reportes
        </h1>
        <p className="text-slate-500 mt-1">
          Información general del inventario J&E
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab('productos')}
          className={`px-5 py-3 rounded-xl ${
            tab === 'productos'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700'
          }`}
        >
          Productos
        </button>

        <button
          onClick={() => setTab('bajoStock')}
          className={`px-5 py-3 rounded-xl ${
            tab === 'bajoStock'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700'
          }`}
        >
          Bajo stock
        </button>

        <button
          onClick={() => setTab('movimientos')}
          className={`px-5 py-3 rounded-xl ${
            tab === 'movimientos'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700'
          }`}
        >
          Movimientos
        </button>
      </div>

      {tab === 'productos' && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Código</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Precio venta</th>
                <th className="text-left p-4">Stock</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-medium">{producto.codigo}</td>
                  <td className="p-4">{producto.nombre}</td>
                  <td className="p-4">{producto.categoria}</td>
                  <td className="p-4">S/ {producto.precio_venta}</td>
                  <td className="p-4">{producto.stock_actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'bajoStock' && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Código</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Stock actual</th>
                <th className="text-left p-4">Stock mínimo</th>
                <th className="text-left p-4">Estado</th>
              </tr>
            </thead>

            <tbody>
              {bajoStock.map((producto) => (
                <tr key={producto.id} className="border-t hover:bg-red-50">
                  <td className="p-4 font-medium">{producto.codigo}</td>
                  <td className="p-4">{producto.nombre}</td>
                  <td className="p-4 text-red-600 font-bold">
                    {producto.stock_actual}
                  </td>
                  <td className="p-4">{producto.stock_minimo}</td>
                  <td className="p-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Bajo stock
                    </span>
                  </td>
                </tr>
              ))}

              {bajoStock.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan="5">
                    No hay productos con bajo stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'movimientos' && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Tipo</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Cantidad</th>
                <th className="text-left p-4">Subtotal</th>
                <th className="text-left p-4">Usuario</th>
                <th className="text-left p-4">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {movimientos.map((mov, index) => (
                <tr key={index} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        mov.tipo === 'ENTRADA'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {mov.tipo}
                    </span>
                  </td>

                  <td className="p-4">{mov.producto}</td>
                  <td className="p-4">{mov.cantidad}</td>
                  <td className="p-4">S/ {mov.subtotal}</td>
                  <td className="p-4">{mov.usuario}</td>
                  <td className="p-4">
                    {new Date(mov.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reportes;