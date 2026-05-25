import { Menu } from 'lucide-react';

function Navbar({ setMenuOpen }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
      
      <div className="flex items-center gap-4">
        
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden"
        >
          <Menu size={28} />
        </button>

        <div>
          <h1 className="text-lg md:text-2xl font-bold text-slate-800">
            Sistema de Inventario J&E
          </h1>
        </div>
      </div>

      <div className="text-sm md:text-base text-slate-600">
        {usuario?.nombre} · {usuario?.rol}
      </div>
    </header>
  );
}

export default Navbar;