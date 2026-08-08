import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../component/Alert.jsx';
import { login } from '../../API/authApi.js';
import { getErrorMessage } from '../../API/errors.js';

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
      const { token, refreshToken, user } = await login({ email: identifier, password });

      if (!user || user.role !== 'admin') {
        setError('Seuls les administrateurs peuvent accéder au backoffice');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', user.role);
      navigate('/admin');
    } catch (err) {
      const message = getErrorMessage(err) || 'Connexion au serveur impossible';
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
