import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowLeftRight,
  BarChart3,
  Users,
  LogOut,
  X
} from 'lucide-react';

function Sidebar({ menuOpen, setMenuOpen }) {
  const location = useLocation();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esAdmin = usuario?.rol === 'ADMIN';

  const links = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/productos',
      label: 'Productos',
      icon: Package
    },
    {
      path: '/stock',
      label: 'Stock',
      icon: Boxes
    },
    {
      path: '/movimientos',
      label: 'Movimientos',
      icon: ArrowLeftRight
    },
    {
      path: '/reportes',
      label: 'Reportes',
      icon: BarChart3
    }
  ];

  if (esAdmin) {
    links.push({
      path: '/usuarios',
      label: 'Usuarios',
      icon: Users
    });
  }

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-screen w-64
          bg-slate-950 text-white flex flex-col
          transition-transform duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">
              J&E
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Inventory System
            </p>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                  active
                    ? 'bg-white text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={cerrarSesion}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;