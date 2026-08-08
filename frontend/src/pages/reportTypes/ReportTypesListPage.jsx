import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/DataTable.jsx';
import ConfirmDialog from '../../component/ConfirmDialog.jsx';
import Alert from '../../component/Alert.jsx';
import { listReportTypes, deleteReportType } from '../../API/reportTypeApi.js';
import { getErrorMessage } from '../../API/errors.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

const PAGE_SIZE = 20;

function ReportTypesListPage() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
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
      const result = await listReportTypes({ limit: PAGE_SIZE, offset, search: debouncedSearch });
      setTypes(result.data || []);
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
      await deleteReportType(toDelete.id);
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
    { key: 'label', label: 'Label' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Types de signalement</h1>
        <button onClick={() => navigate('new')}>Nouveau type</button>
      </div>
      <input
        type="search"
        className="search-input"
        placeholder="Rechercher un type..."
        value={search}
        onChange={handleSearchChange}
      />
      <Alert type="error" message={error} />
      {loading && <p>Chargement...</p>}
      <DataTable
        columns={columns}
        data={types}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />
      <div className="form-actions">
        <button onClick={handlePrevious} disabled={offset === 0}>Précédent</button>
        <button onClick={handleNext} disabled={!pagination.hasMore}>Suivant</button>
      </div>
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

