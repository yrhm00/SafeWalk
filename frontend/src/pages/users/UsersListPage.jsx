import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Alert from '../../components/Alert.jsx';
import { listUsers, deleteUser } from '../../services/userApi.js';

function UsersListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : data.rows || []);
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
      await deleteUser(toDelete.id);
      setToDelete(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

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
