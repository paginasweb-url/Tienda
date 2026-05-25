import { useEffect, useState } from 'react';
import api from '../api/axios';

function Stock() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerStock = async () => {
    try {
      const { data } = await api.get('/stock');

      setProductos(data.data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerStock();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-500">
        Cargando stock...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Control de Stock
        </h1>

        <p className="text-slate-500 mt-1">
          Gestión y monitoreo de inventario
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">
            Productos totales
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {productos.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">
            Bajo stock
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-600">
            {
              productos.filter(
                p => p.stock_actual <= p.stock_minimo
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">
            Stock total
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {
              productos.reduce(
                (acc, item) => acc + Number(item.stock_actual),
                0
              )
            }
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-slate-500 text-sm">
            Productos críticos
          </p>

          <h2 className="text-3xl font-bold mt-2 text-orange-500">
            {
              productos.filter(
                p => p.stock_actual <= 2
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Código</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Color</th>
                <th className="text-left p-4">Talla</th>
                <th className="text-left p-4">Stock actual</th>
                <th className="text-left p-4">Stock mínimo</th>
                <th className="text-left p-4">Estado</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4 font-medium">
                    {producto.codigo}
                  </td>

                  <td className="p-4">
                    {producto.nombre}
                  </td>

                  <td className="p-4">
                    {producto.color}
                  </td>

                  <td className="p-4">
                    {producto.talla}
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
                    {producto.stock_minimo}
                  </td>

                  <td className="p-4">
                    {
                      producto.stock_actual <= producto.stock_minimo
                        ? (
                          <span className="text-red-600 font-semibold">
                            Bajo stock
                          </span>
                        )
                        : (
                          <span className="text-green-600 font-semibold">
                            Disponible
                          </span>
                        )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stock;