import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Stock from './pages/Stock';
import Movimientos from './pages/Movimientos';
import Reportes from './pages/Reportes';

import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Productos />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Stock />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/movimientos"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Movimientos />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reportes />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/usuarios"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Usuarios />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;