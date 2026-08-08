import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '../../component/Alert.jsx';
import { createReportType, getReportTypeById, updateReportType } from '../../API/reportTypeApi.js';
import { getErrorMessage } from '../../API/errors.js';

function ReportTypeFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ label: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        try {
          const type = await getReportTypeById(id);
          setValues(type);
        } catch (err) {
          setError(getErrorMessage(err));
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
        await createReportType({ label: values.label });
      } else {
        await updateReportType(id, { label: values.label });
      }
      navigate('/admin/report-types');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1>{mode === 'create' ? 'Nouveau type' : `Éditer le type #${id}`}</h1>
      <Alert type="error" message={error} />
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Label
          <input name="label" value={values.label} onChange={handleChange} required />
        </label>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/report-types')}>
            Annuler
          </button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

ReportTypeFormPage.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
};

export default ReportTypeFormPage;

