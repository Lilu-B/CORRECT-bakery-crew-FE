import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { fetchPendingUsers, approveUserById, deleteUserById } from '../api/pendingUsers';
import type { User } from '../types/user';

const PendingUserCards = () => {
  const { user, loading: userLoading } = useUser();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const users = await fetchPendingUsers();
      setPendingUsers(users);
    } catch (err) {
      console.error('Error loading pending users:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    if (userLoading || !user || (user.role !== 'manager' && user.role !== 'developer')) return;
    loadUsers();
  }, [user, userLoading]);

  const handleApprove = async (id: number) => {
    try {
      await approveUserById(id);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserById(id);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (pendingLoading) return <p>Loading pending users...</p>;

  return (
    <section aria-labelledby="pending-users-heading">
      <h3 id="pending-users-heading">Pending Users</h3>

      {pendingUsers.length === 0 ? (
        <p aria-live="polite" className="error-message">No pending users to approve.</p>
      ) : (
        pendingUsers.map(user => (
          <div key={user.id} className="card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone || 'N/A'}</p>
            <p>Shift: {user.shift}</p>
            <p>Role: {user.role}</p>

            <div className="button-group">
              <button
                onClick={() => handleApprove(user.id)}
                aria-label="Approve user"
                className="button-green"
              >
                Approve
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                aria-label="Delete user"
                className="button-red"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default PendingUserCards;
