function Navbar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-slate-700">
        Sistema de Inventario J&E
      </h2>

      <div className="text-sm text-slate-600">
        {usuario?.nombre} · {usuario?.rol}
      </div>
    </header>
  );
}

export default Navbar;