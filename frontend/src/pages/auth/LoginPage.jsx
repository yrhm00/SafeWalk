import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }

    // On stocke les identifiants pour Basic Auth, ils seront utilisés par apiClient
    localStorage.setItem('basic_email', email);
    localStorage.setItem('basic_password', password);

    // On peut faire un petit ping pour vérifier que les identifiants sont corrects
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/users/1', {
        headers: {
          Authorization: 'Basic ' + btoa(`${email}:${password}`),
        },
      });

      if (res.status === 401 || res.status === 403) {
        setError('Identifiants invalides ou accès refusé');
        return;
      }

      // Si ça passe (200 ou autre 2xx), on considère le login OK
      navigate('/admin');
    } catch (e) {
      setError('Connexion au serveur impossible');
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Connexion admin</h1>
        <Alert type="error" message={error} />
        <label>
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} />
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
