import { useEffect, useState } from 'react';
import {
  Package,
  Boxes,
  AlertTriangle,
  Users,
  TrendingUp,
  ShoppingBag,
  BarChart3,
  RefreshCw
} from 'lucide-react';

import api from '../api/axios';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const obtenerDashboard = async () => {
    try {
      const { data } = await api.get('/reportes/dashboard');
      setDashboard(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-slate-500" size={36} />
          <p className="mt-3 text-slate-500">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Productos',
      value: dashboard?.total_productos || 0,
      icon: Package,
      color: 'bg-blue-100 text-blue-700',
      bg: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Categorías',
      value: dashboard?.total_categorias || 0,
      icon: Boxes,
      color: 'bg-green-100 text-green-700',
      bg: 'from-green-500 to-green-700'
    },
    {
      title: 'Bajo stock',
      value: dashboard?.productos_bajo_stock || 0,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700',
      bg: 'from-red-500 to-red-700'
    },
    {
      title: 'Usuarios',
      value: dashboard?.total_usuarios || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-700',
      bg: 'from-purple-500 to-purple-700'
    }
  ];

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 mb-8 shadow-xl">
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -top-20 -right-10" />
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -bottom-24 -left-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-slate-300 text-sm uppercase tracking-widest">
              Panel principal
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Dashboard J&E
            </h1>

            <p className="text-slate-300 mt-3 max-w-xl">
              Resumen general del inventario, productos, usuarios y alertas de stock.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3">
              <ShoppingBag size={34} />

              <div>
                <p className="text-sm text-slate-300">Sistema activo</p>
                <p className="text-2xl font-bold">J&E Store</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl shadow p-6 hover:-translate-y-1 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-slate-900">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}
                >
                  <Icon size={28} />
                </div>
              </div>

              <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full w-2/3 bg-gradient-to-r ${card.bg}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Información general
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Estado actual del inventario
              </p>
            </div>

            <BarChart3 className="text-slate-400" size={28} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50">
              <p className="text-slate-500 text-sm">
                Stock total
              </p>

              <h3 className="text-5xl font-bold mt-3 text-green-600">
                {dashboard?.stock_total || 0}
              </h3>

              <p className="text-sm text-slate-500 mt-3">
                Unidades registradas en inventario.
              </p>
            </div>

            <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50">
              <p className="text-slate-500 text-sm">
                Productos críticos
              </p>

              <h3 className="text-5xl font-bold mt-3 text-red-600">
                {dashboard?.productos_bajo_stock || 0}
              </h3>

              <p className="text-sm text-slate-500 mt-3">
                Productos que necesitan reposición.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-5">
            <TrendingUp size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Resumen del sistema
          </h2>

          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            El sistema J&E permite gestionar productos, controlar stock,
            registrar entradas y salidas, y visualizar reportes administrativos.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Inventario</span>
              <span className="font-semibold text-green-600">Activo</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Reportes</span>
              <span className="font-semibold text-green-600">Disponible</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Alertas</span>
              <span className="font-semibold text-green-600">Habilitadas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;