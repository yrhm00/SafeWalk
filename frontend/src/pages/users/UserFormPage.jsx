import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../component/Alert.jsx';
import { createUser, getUserById, updateUser } from '../../API/userApi.js';

function UserFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({
    id: undefined,
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'citizen',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        try {
          const user = await getUserById(id);
          setValues(v => ({ ...v, ...user, password: '' }));
        } catch (e) {
          setError(e.message);
        }
      })();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'create') {
        const payload = { ...values };
        if (!payload.password) delete payload.password;
        await createUser(payload);
      } else {
        const payload = { ...values };
        if (!payload.password) delete payload.password;
        await updateUser(payload);
      }
      navigate('/admin/users');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>{mode === 'create' ? 'Nouvel utilisateur' : `Éditer l'utilisateur #${id}`}</h1>
      <Alert type="error" message={error} />
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nom
          <input name="name" value={values.name} onChange={handleChange} />
        </label>
        <label>
          Username
          <input name="username" value={values.username} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={values.email} onChange={handleChange} required />
        </label>
        <label>
          Mot de passe
          <input type="password" name="password" value={values.password} onChange={handleChange} />
        </label>
        <label>
          Rôle
          <select name="role" value={values.role} onChange={handleChange}>
            <option value="citizen">citizen</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/users')}>
            Annuler
          </button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

export default UserFormPage;

