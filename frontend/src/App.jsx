import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import UsersListPage from './pages/users/UsersListPage.jsx';
import UserFormPage from './pages/users/UserFormPage.jsx';
import ReportsListPage from './pages/reports/ReportsListPage.jsx';
import ReportDetailPage from './pages/reports/ReportDetailPage.jsx';
import ReportTypesListPage from './pages/reportTypes/ReportTypesListPage.jsx';
import ReportTypeFormPage from './pages/reportTypes/ReportTypeFormPage.jsx';
import ZonesListPage from './pages/zones/ZonesListPage.jsx';
import ZoneFormPage from './pages/zones/ZoneFormPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';

// Petit helper pour savoir si on est connecté et admin
function isAuthenticatedAdmin() {
  const email = localStorage.getItem('basic_email');
  const password = localStorage.getItem('basic_password');
  const role = localStorage.getItem('role');
  return !!email && !!password && role === 'admin';
}

function RequireAdmin({ children }) {
  if (!isAuthenticatedAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/* Quand on arrive sur la racine, on va directement sur /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      {/* Toutes les routes d'admin sont protégées */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="users/new" element={<UserFormPage mode="create" />} />
        <Route path="users/:id/edit" element={<UserFormPage mode="edit" />} />
        <Route path="reports" element={<ReportsListPage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="report-types" element={<ReportTypesListPage />} />
        <Route path="report-types/new" element={<ReportTypeFormPage mode="create" />} />
        <Route path="report-types/:id/edit" element={<ReportTypeFormPage mode="edit" />} />
        <Route path="zones" element={<ZonesListPage />} />
        <Route path="zones/new" element={<ZoneFormPage mode="create" />} />
        <Route path="zones/:id/edit" element={<ZoneFormPage mode="edit" />} />
      </Route>

      {/* Toute autre URL redirige vers /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
