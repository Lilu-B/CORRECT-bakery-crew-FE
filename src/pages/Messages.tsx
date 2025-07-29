import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchInboxMessages, fetchSentMessages } from '../api/messages';
import InboxMsg from '../components/InboxMsg';
import SentMsg from '../components/SentMsg';
import type { AxiosError } from 'axios';
import type { Message } from '../types/message';

const Messages = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;

      try {
        const [inbox, sent] = await Promise.all([
          fetchInboxMessages(),
          fetchSentMessages(),
        ]);

        const sortedInbox = inbox.sort(
          (a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
        );
        const sortedSent = sent.sort(
          (a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
        );

        setInboxMessages(sortedInbox);
        setSentMessages(sortedSent);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setError(error.response?.data?.message || 'Failed to load messages');
        setInboxMessages([]);
        setSentMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [user]);

  if (loading || loadingMessages) return <p>Loading messages...</p>;
  if (!user) return <p>User not found</p>;

  const canSendMessage =
    user.role === 'developer' ||
    user.role === 'manager' ||
    user.role === 'user';

  return (
    <div className="main-content" aria-labelledby="messages-heading">
      <section>
        <h2 id="messages-heading">All Messages</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('inbox')}
            className={activeTab === 'inbox' ? 'button-green' : 'button-gray'}
          >
            📥 Inbox
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={activeTab === 'sent' ? 'button-green' : 'button-gray'}
          >
            📤 Sent
          </button>
        </div>
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section aria-live="polite">
        {activeTab === 'inbox' ? (
          <InboxMsg messages={inboxMessages} /> 
        ) : (
          <SentMsg messages={sentMessages} />   
        )}
      </section>

      {canSendMessage && (
        <button
          onClick={() => navigate('/messages/create')}
          aria-label="Create new message"
          className="button-green button-long"
          style={{ marginTop: '2rem' }}
        >
          ✏️ Create a message
        </button>
      )}
    </div>
  );
};

export default Messages;