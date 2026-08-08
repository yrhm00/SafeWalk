import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/DataTable.jsx';
import ConfirmDialog from '../../component/ConfirmDialog.jsx';
import Alert from '../../component/Alert.jsx';
import { listReportTypes, deleteReportType } from '../../API/reportTypeApi.js';

function ReportTypesListPage() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listReportTypes();
      setTypes(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
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
      await deleteReportType(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'label', label: 'Label' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Types de signalement</h1>
        <button onClick={() => navigate('new')}>Nouveau type</button>
      </div>
      <Alert type="error" message={error} />
      {loading && <p>Chargement...</p>}
      <DataTable
        columns={columns}
        data={types}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le type"
        message={toDelete ? `Supprimer le type ${toDelete.label} ?` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default ReportTypesListPage;

