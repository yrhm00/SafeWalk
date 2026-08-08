import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '../../component/Alert.jsx';
import { createReport, getReportById, updateReport } from '../../API/reportApi.js';
import { listReportTypes } from '../../API/reportTypeApi.js';
import { listZones } from '../../API/zoneApi.js';
import { getErrorMessage } from '../../API/errors.js';

function ReportFormPage({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [values, setValues] = useState({
        title: '',
        description: '',
        status: 'pending',
        severity: 'medium',
        latitude: '',
        longitude: '',
        type_id: '',
        zone_id: '',
    });
    const [types, setTypes] = useState([]);
    const [zones, setZones] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const typesResult = await listReportTypes({ limit: 100 });
                setTypes(typesResult.data || []);
                const zonesResult = await listZones({ limit: 100 });
                setZones(zonesResult.data || []);
            } catch (err) {
                setError(getErrorMessage(err));
            }
        })();

        if (mode === 'edit' && id) {
            (async () => {
                try {
                    const report = await getReportById(id);
                    setValues(v => ({ ...v, ...report }));
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

        const payload = {
            title: values.title,
            description: values.description,
            severity: values.severity,
            type_id: Number(values.type_id),
            zone_id: values.zone_id ? Number(values.zone_id) : null,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
        };

        try {
            if (mode === 'edit') {
                await updateReport(id, { ...payload, status: values.status });
            } else {
                await createReport(payload);
            }
            navigate('/admin/reports');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div>
            <h1>{mode === 'create' ? 'Nouveau signalement' : `Éditer le signalement #${id}`}</h1>
            <Alert type="error" message={error} />
            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Titre
                    <input name="title" value={values.title} onChange={handleChange} required />
                </label>
                <label>
                    Description
                    <textarea name="description" value={values.description} onChange={handleChange} required />
                </label>
                {mode === 'edit' && (
                    <label>
                        Statut
                        <select name="status" value={values.status} onChange={handleChange}>
                            <option value="pending">En attente</option>
                            <option value="validated">Validé</option>
                            <option value="resolved">Résolu</option>
                        </select>
                    </label>
                )}
                <label>
                    Sévérité
                    <select name="severity" value={values.severity} onChange={handleChange}>
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                    </select>
                </label>
                <label>
                    Type
                    <select name="type_id" value={values.type_id} onChange={handleChange} required>
                        <option value="">Sélectionner un type</option>
                        {types.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Zone
                    <select name="zone_id" value={values.zone_id || ''} onChange={handleChange}>
                        <option value="">Aucune zone</option>
                        {zones.map(z => (
                            <option key={z.id} value={z.id}>{z.name}</option>
                        ))}
                    </select>
                </label>
                <div className="form-row">
                    <label>
                        Latitude
                        <input name="latitude" type="number" step="any" value={values.latitude} onChange={handleChange} required />
                    </label>
                    <label>
                        Longitude
                        <input name="longitude" type="number" step="any" value={values.longitude} onChange={handleChange} required />
                    </label>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/reports')}>
                        Annuler
                    </button>
                    <button type="submit">Enregistrer</button>
                </div>
            </form>
        </div>
    );
}

ReportFormPage.propTypes = {
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
};

export default ReportFormPage;
