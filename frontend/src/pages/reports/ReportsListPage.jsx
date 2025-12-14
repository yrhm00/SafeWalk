import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Alert from '../../components/Alert.jsx';
import CommentsDialog from '../../components/CommentsDialog.jsx';
import { listReports, deleteReport } from '../../services/reportApi.js';

function ReportsListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listReports();
      setReports(data.items || data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteReport(toDelete.id);
      setToDelete(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Titre' },
    { key: 'type_label', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'zone_name', label: 'Zone' },
    {
      key: 'comments',
      label: 'Commentaires',
      render: (_, row) => (
        <button onClick={() => setSelectedReport(row)}>
          Voir les commentaires
        </button>
      )
    },
    {
      key: 'upvotes',
      label: 'Votes +',
      render: (val) => <span style={{ color: 'green', fontWeight: 'bold' }}>+{val}</span>
    },
    {
      key: 'downvotes',
      label: 'Votes -',
      render: (val) => <span style={{ color: 'red', fontWeight: 'bold' }}>-{val}</span>
    },
    { key: 'status', label: 'Statut' },
    { key: 'severity', label: 'Sévérité' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Signalements</h1>
        <button onClick={() => navigate('new')}>Nouveau signalement</button>
      </div>
      <Alert type="error" message={error} />
      {loading && <p>Chargement...</p>}
      <DataTable
        columns={columns}
        data={reports}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />
      {selectedReport && (
        <CommentsDialog
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le signalement"
        message={toDelete ? `Supprimer le signalement ${toDelete.title} ?` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default ReportsListPage;

