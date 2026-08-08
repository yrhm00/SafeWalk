import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/DataTable.jsx';
import ConfirmDialog from '../../component/ConfirmDialog.jsx';
import Alert from '../../component/Alert.jsx';
import CommentsDialog from '../../component/CommentsDialog.jsx';
import { listReports, deleteReport } from '../../API/reportApi.js';
import { getErrorMessage } from '../../API/errors.js';

const PAGE_SIZE = 20;

function ReportsListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await listReports({ limit: PAGE_SIZE, offset });
      setReports(result.data || []);
      setPagination(result.pagination || { total: 0, hasMore: false });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [offset]);

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteReport(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handlePrevious = () => setOffset(prev => Math.max(prev - PAGE_SIZE, 0));
  const handleNext = () => setOffset(prev => prev + PAGE_SIZE);

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
      render: (val) => <span className="vote-up">+{val}</span>
    },
    {
      key: 'downvotes',
      label: 'Votes -',
      render: (val) => <span className="vote-down">-{val}</span>
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
        onView={row => navigate(`${row.id}`)}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />
      <div className="form-actions">
        <button onClick={handlePrevious} disabled={offset === 0}>Précédent</button>
        <button onClick={handleNext} disabled={!pagination.hasMore}>Suivant</button>
      </div>
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

