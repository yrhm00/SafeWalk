import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert.jsx';
import { apiRequest } from '../../services/apiClient.js';

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // email ou username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Email ou username et mot de passe requis');
      return;
    }

    // Pour le moment, le backend Basic Auth ne connaît que l'email.
    // On stocke quand même l'identifiant tel quel ; si c'est un username,
    // il faudra adapter le middleware plus tard.
    localStorage.setItem('basic_email', identifier);
    localStorage.setItem('basic_password', password);

    try {
      const me = await apiRequest('/users/me');

      if (!me || me.role !== 'admin') {
        setError('Seuls les administrateurs peuvent accéder au backoffice');
        return;
      }

      localStorage.setItem('role', me.role);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Connexion au serveur impossible');
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
