import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../component/Alert.jsx';
import { getReportById } from '../../API/reportApi.js';
import { getErrorMessage } from '../../API/errors.js';

function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    })();
  }, [id]);

  if (!report) {
    return (
      <div>
        <Alert type="error" message={error} />
        {!error && <p>Chargement...</p>}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/reports')}>&larr; Retour</button>
      <h1>Signalement #{report.id}</h1>
      <Alert type="error" message={error} />
      <section>
        <h2>Infos générales</h2>
        <p><strong>Titre :</strong> {report.title}</p>
        <p><strong>Description :</strong> {report.description}</p>
        <p><strong>Statut :</strong> {report.status}</p>
        <p><strong>Sévérité :</strong> {report.severity}</p>
        <p><strong>Type :</strong> {report.type_label}</p>
        <p><strong>Zone :</strong> {report.zone_name}</p>
        <p><strong>Signalé par :</strong> {report.user_name}</p>
        <p><strong>Coordonnées :</strong> {report.latitude}, {report.longitude}</p>
        <p><strong>Créé le :</strong> {new Date(report.created_at).toLocaleString()}</p>
      </section>
      {report.image_url && (
        <section>
          <h2>Photo</h2>
          <img src={report.image_url} alt={report.title} className="report-photo" />
        </section>
      )}
    </div>
  );
}

export default ReportDetailPage;

