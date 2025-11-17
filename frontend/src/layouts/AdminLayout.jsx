import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // On nettoie toutes les infos d'auth utilisées par le backoffice
    localStorage.removeItem('basic_email');
    localStorage.removeItem('basic_password');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <Link to="/admin">SmartCity Backoffice</Link>
        </div>
        <nav>
          <NavLink to="users">Utilisateurs</NavLink>
          <NavLink to="reports">Signalements</NavLink>
          <NavLink to="report-types">Types de signalement</NavLink>
          <NavLink to="zones">Zones</NavLink>
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <span>Zone d'administration</span>
          <button onClick={handleLogout}>Déconnexion</button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
