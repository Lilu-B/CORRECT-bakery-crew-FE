import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchAllUsers } from '../api/users';
import { createMessage } from '../api/messages';
import type { User } from '../types/user';
import type { AxiosError } from 'axios';

const MessageCreate = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allowedUsers, setAllowedUsers] = useState<User[]>([]);

  const location = useLocation();
  const replyToId = location.state?.replyToId || '';
  // const replyToName = location.state?.replyToName || '';

  const [recipientId, setRecipientId] = useState(replyToId);
  // const [recipientName, setRecipientName] = useState(replyToName);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
        try {
        const res = await fetchAllUsers();
        setAllUsers(res); 

        const allowed = res.filter((u: User) => {
            if (!user) return false;
            if (user.id === u.id) return false;

            if (user.role === 'developer') return true;

            if (user.role === 'manager') {
            return (
                u.role === 'developer' ||
                u.role === 'manager' ||
                (u.role === 'user' && u.shift === user.shift && u.managerId === user.id)
            );
            }

            if (user.role === 'user') {
            return (
                (u.role === 'manager' && u.id === user.managerId) ||
                (u.role === 'user' && u.managerId === user.managerId)
            );
            }

            return false;
        });

        setAllowedUsers(allowed);
        } catch (err) {
        const error = err as AxiosError<{ msg?: string }>;
        setError(error.response?.data?.msg || 'Failed to load users');
        }
    };

    loadUsers();
    }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!recipientId) return setError('Please select a recipient.');
    if (!content.trim()) return setError('Message cannot be empty.');

    try {
      await createMessage({
        recipientId: recipientId,  // ???
        content,
      });

      setRecipientId(null);   // ???
      setContent('');
      setError(null);

      navigate('/messages');
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      setError(error.response?.data?.msg || 'Failed to send message');
    }
  };

  if (!user) return <p>User not found</p>;

  return (
    <div className="main-content">
      <section>
        <h2>Create Message</h2>

        <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
          <div>
            <label htmlFor="recipient-select"><h3>To:</h3></label>
            <select
              id="recipient-select"
              value={recipientId ?? ''}
              onChange={(e) => setRecipientId(Number(e.target.value))}
              required
              style={{
                backgroundColor: '#333',
                color: '#fff',
                padding: '10px',
                borderRadius: '4px',
                border: 'none',
                width: '100%',
              }}
            >
              <option value="" disabled>Select a recipient</option>
              {allowedUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="message-content"><h3>Message:</h3></label>
            <textarea
              id="message-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Write your message..."
              style={{ width: '100%' }}
              required
            />
          </div>

          {error && (
            <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit" className="button-green" aria-label="Send message">
              Send
            </button>
            <button
              type="button"
              className="button-red"
              onClick={() => navigate('/messages')}
              aria-label="Cancel message creation"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      {/* 🔽 DEBUG: All Users List  */}
        <section style={{ marginTop: '2rem' }}>
        <h3>All Users (debug)</h3>
        <ul>
            {allUsers.map((u) => (
            <li key={u.id}>
                {u.name} — {u.role}
                {u.shift ? ` (${u.shift} shift)` : ''}
                {u.managerId ? `, Manager ID: ${u.managerId}` : ''}
            </li>
            ))}
        </ul>
        </section>
    </div>
  );
};

export default MessageCreate;