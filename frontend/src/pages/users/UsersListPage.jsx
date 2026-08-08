import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/DataTable.jsx';
import ConfirmDialog from '../../component/ConfirmDialog.jsx';
import Alert from '../../component/Alert.jsx';
import { listUsers, deleteUser } from '../../API/userApi.js';

const PAGE_SIZE = 20;

function UsersListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await listUsers({ limit: PAGE_SIZE, offset });
      setUsers(result.data || []);
      setPagination(result.pagination || { total: 0, hasMore: false });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
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
      await deleteUser(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handlePrevious = () => setOffset(prev => Math.max(prev - PAGE_SIZE, 0));
  const handleNext = () => setOffset(prev => prev + PAGE_SIZE);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle' },
    { key: 'created_at', label: 'Date de création' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Utilisateurs</h1>
        <button onClick={() => navigate('new')}>Nouvel utilisateur</button>
      </div>

      <Alert type="error" message={error} />
      {loading && <p>Chargement...</p>}

      <DataTable
        columns={columns}
        data={users}
        onEdit={row => navigate(`${row.id}/edit`)}
        onDelete={row => setToDelete(row)}
      />

      <div className="form-actions">
        <button onClick={handlePrevious} disabled={offset === 0}>Précédent</button>
        <button onClick={handleNext} disabled={!pagination.hasMore}>Suivant</button>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer l'utilisateur"
        message={toDelete ? `Supprimer l'utilisateur ${toDelete.username} ?` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default UsersListPage;
