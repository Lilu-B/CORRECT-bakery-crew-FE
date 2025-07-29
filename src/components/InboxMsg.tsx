import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Message } from '../types/message';

// ✅ Переименовали msg -> messages, т.к. это массив сообщений
interface Props {
  messages: Message[];
}

function InboxMsg({ messages }: Props) {
  const navigate = useNavigate();

  // ✅ Здесь тоже messages
  if (messages.length === 0) {
    return <p aria-live="polite">No messages in inbox.</p>;
  }

  return (
    <>
      {messages.map((msg) => {
        const isUnread = !msg.isRead;
        const cardClass = isUnread ? 'card active clickable' : 'card clickable';

        return (
          <div
            key={msg.id}
            className={cardClass}
            role="button"
            tabIndex={0}
            aria-label={`Message from ${msg.senderName || 'Unknown'} on ${format(new Date(msg.sentDate), 'd MMM yyyy')}`}
            onClick={() => navigate(`/messages/${msg.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/messages/${msg.id}`);
              }
            }}
          >
            <h3>From: {msg.senderName || `User #${msg.senderId}`}</h3>
            <p>{msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content}</p>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              Sent: {format(new Date(msg.sentDate), 'd MMM yyyy, HH:mm')}
            </p>
            {msg.messageType === 'system' && (
              <span style={{ fontSize: '0.75rem', color: '#a00' }}>System message</span>
            )}
          </div>
        );
      })}
    </>
  );
}

export default InboxMsg;