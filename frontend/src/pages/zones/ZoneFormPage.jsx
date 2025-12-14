import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert.jsx';
import { createZone, getZoneById, updateZone } from '../../services/zoneApi.js';

function ZoneFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ id: undefined, name: '', description: '', geom: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        try {
          const zone = await getZoneById(id);
          setValues(zone);
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
        await createZone(values);
      } else {
        await updateZone(values);
      }
      navigate('/admin/zones');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>{mode === 'create' ? 'Nouvelle zone' : `Éditer la zone #${id}`}</h1>
      <Alert type="error" message={error} />
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nom
          <input name="name" value={values.name} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={values.description} onChange={handleChange} />
        </label>
        <label>
          Geom (JSON/WKT)
          <textarea name="geom" value={values.geom} onChange={handleChange} />
        </label>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/zones')}>
            Annuler
          </button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

export default ZoneFormPage;

