import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../component/Alert.jsx';
import { login } from '../../API/authApi.js';
import { getMyProfile } from '../../API/userApi.js';

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Email et mot de passe requis');
      return;
    }

    try {
      const { token } = await login({ email: identifier, password });
      localStorage.setItem('token', token);

      const me = await getMyProfile();

      if (!me || me.role !== 'admin') {
        setError('Seuls les administrateurs peuvent accéder au backoffice');
        localStorage.removeItem('token');
        return;
      }

      localStorage.setItem('role', me.role);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.message || 'Connexion au serveur impossible';
      setError(message);
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Connexion admin</h1>
        <Alert type="error" message={error} />
        <label>
          Email / username
          <input value={identifier} onChange={e => setIdentifier(e.target.value)} />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginPage;
