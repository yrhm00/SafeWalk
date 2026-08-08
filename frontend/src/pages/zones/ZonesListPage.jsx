import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/DataTable.jsx';
import ConfirmDialog from '../../component/ConfirmDialog.jsx';
import Alert from '../../component/Alert.jsx';
import { listZones, deleteZone } from '../../API/zoneApi.js';
import { getErrorMessage } from '../../API/errors.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

const PAGE_SIZE = 20;

function ZonesListPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await listZones({ limit: PAGE_SIZE, offset, search: debouncedSearch });
      setZones(result.data || []);
      setPagination(result.pagination || { total: 0, hasMore: false });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [offset, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setOffset(0);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteZone(toDelete.id);
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
    { key: 'name', label: 'Nom' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Zones</h1>
        <button onClick={() => navigate('new')}>Nouvelle zone</button>
      </div>
      <input
        type="search"
        className="search-input"
        placeholder="Rechercher une zone..."
        value={search}
        onChange={handleSearchChange}
      />
      <Alert type="error" message={error} />
      {loading && <p>Chargement...</p>}
      <DataTable
        columns={columns}
        data={zones}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />
      <div className="form-actions">
        <button onClick={handlePrevious} disabled={offset === 0}>Précédent</button>
        <button onClick={handleNext} disabled={!pagination.hasMore}>Suivant</button>
      </div>
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

