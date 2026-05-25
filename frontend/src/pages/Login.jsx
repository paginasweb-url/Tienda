import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shirt, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-20 -right-20" />

      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        <div className="hidden md:flex flex-col justify-between p-10 bg-slate-900 text-white">
          <div>
            <div className="w-16 h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center mb-6">
              <Shirt size={32} />
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              J&E Inventory
            </h1>

            <p className="text-slate-300 mt-4 leading-relaxed">
              Sistema web para controlar productos, stock, entradas,
              salidas y reportes de una tienda de ropa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm text-slate-300">Control de stock</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-slate-300">Acceso web</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10">
          <div className="mb-8">
            <div className="md:hidden mx-auto w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-5">
              J&E
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              Bienvenido
            </h2>

            <p className="text-slate-500 mt-2">
              Inicia sesión para acceder al sistema de inventario.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Correo electrónico
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />

                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="admin@jye.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />

                <input
                  type={verPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />

                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {verPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            J&E · Sistema de Inventario para Tienda de Ropa
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;