import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Alert from '../../components/Alert.jsx';
import { listZones, deleteZone } from '../../services/zoneApi.js';

function ZonesListPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listZones();
      setZones(Array.isArray(data) ? data : data.rows || []);
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
      await deleteZone(toDelete.id);
      setToDelete(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Zones</h1>
        <button onClick={() => navigate('new')}>Nouvelle zone</button>
      </div>
      <Alert type="error" message={error} />
      {loading && <p>Chargement...</p>}
      <DataTable
        columns={columns}
        data={zones}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer la zone"
        message={toDelete ? `Supprimer la zone ${toDelete.name} ?` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default ZonesListPage;

