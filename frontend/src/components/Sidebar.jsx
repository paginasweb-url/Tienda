import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowLeftRight,
  BarChart3,
  LogOut,
  Users
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ALMACENERO', 'VENDEDOR'] },
    { path: '/productos', label: 'Productos', icon: Package, roles: ['ADMIN', 'ALMACENERO'] },
    { path: '/stock', label: 'Stock', icon: Boxes, roles: ['ADMIN', 'ALMACENERO', 'VENDEDOR'] },
    { path: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight, roles: ['ADMIN', 'ALMACENERO', 'VENDEDOR'] },
    { path: '/reportes', label: 'Reportes', icon: BarChart3, roles: ['ADMIN', 'ALMACENERO'] },
    { path: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'] }
  ];

  const linksFiltrados = links.filter((item) =>
    item.roles.includes(usuario?.rol)
  );

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        J&E
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {linksFiltrados.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
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

      <button
        onClick={cerrarSesion}
        className="m-4 flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;