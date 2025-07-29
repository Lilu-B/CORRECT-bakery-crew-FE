import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchMessageById, markMessageAsRead, createMessage } from '../api/messages';
import type { Message } from '../types/message';
import type { AxiosError } from 'axios';
import { format } from 'date-fns';

const MessageDetails = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  // const location = useLocation();

  const [message, setMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingError, setSendingError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = Number(messageId);
  const isInvalid = !messageId || isNaN(id);

  useEffect(() => {
    if (isInvalid) {
      setError('Message not found');
      navigate('/messages');
      return;
    }

    const loadMessage = async () => {
      try {
        const data = await fetchMessageById(id);
        setMessage(data);

        if (!data.isRead) {
          await markMessageAsRead(id);
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        alert(error.response?.data?.message || 'Error loading message');
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [isInvalid, messageId, navigate]);

  const handleReply = async () => {
    setSendingError(null);

    if (!message || !user) {
      setSendingError('Missing user or message.');
      return;
    }

    if (!replyContent.trim()) {
      setSendingError('Reply cannot be empty.');
      return;
    }

    const recipientId = message.senderId === user.id ? message.receiverId : message.senderId;

    if (recipientId === user.id) {
      setSendingError('You cannot message yourself.');
      return;
    }

    try {
      await createMessage({
        recipientId,
        content: replyContent,
      });

      setReplyContent('');
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      setSendingError(error.response?.data?.msg || 'Failed to send reply');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user || !message) return <p>Message not found</p>;

  const cardStyle =
    message.messageType === 'system'
      ? { backgroundColor: '#fce9d8', padding: '1rem' }
      : { backgroundColor: '#f8f8f8', padding: '1rem' };

    const formattedDate =
    message.sentDate && !isNaN(new Date(message.sentDate).getTime())
      ? format(new Date(message.sentDate), 'd MMM yyyy, HH:mm')
      : 'Unknown date';

  return (
    <div className="main-content" role="main" aria-labelledby="message-details-heading">
      <section className="card" style={cardStyle}>
        <h2 id="message-details-heading">
          {message.messageType === 'system' ? 'System Message' : 'Personal Message'}
        </h2>

        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          <strong>From:</strong> {message.senderName || 'Unknown'} <br />
          <strong>To:</strong> {message.receiverName || 'Unknown'} <br />
          <strong>Date:</strong> {formattedDate}
        </p>

        <hr style={{ margin: '1rem 0' }} />

        <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>

        <div style={{ marginTop: '2rem' }}>
          <h3>Reply:</h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="Type your reply..."
          />
          {sendingError && <p style={{ color: 'red' }}>{sendingError}</p>}
          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <button
              className="button-green"
              style={{ marginTop: '0.5rem', marginRight: '1rem' }}
              onClick={handleReply}
            >
              Send
            </button>
            <button
              type="button"
              className="button-red"
              onClick={() => navigate('/messages')}
              aria-label="Back to messages"
            >
              Back to messages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MessageDetails;