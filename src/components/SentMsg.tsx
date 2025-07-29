import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Message } from '../types/message';

// ✅ Переименовали msg → messages
interface Props {
  messages: Message[];
}

function SentMsg({ messages }: Props) {
  const navigate = useNavigate();

  if (messages.length === 0) {
    return <p>You haven`t sent any messages yet.</p>;
  }

  return (
    <>
        {messages.map((msg) => {
            console.log('MSG DATA:', msg);
            const isUnread = !msg.isRead;
            const cardClass = isUnread ? 'card active clickable' : 'card clickable';

            // ✅ Безопасная обработка даты
            const dateIsValid = msg.sentDate && !isNaN(new Date(msg.sentDate).getTime());
            const formattedDate = dateIsValid
                ? format(new Date(msg.sentDate), 'd MMM yyyy HH:mm')
                : 'Unknown date';

            // ✅ Защита от отсутствующих имён или ID
            const recipient = msg.receiverName
                ? msg.receiverName
                : msg.receiverId
                ? `User #${msg.receiverId}`
                : 'Unknown recipient';

            return (
                <div
                key={msg.id}
                className={cardClass}
                onClick={() => navigate(`/messages/${msg.id}`)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/messages/${msg.id}`);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Message to ${recipient}, sent on ${formattedDate}`}
                >
                <p>
                    <strong>To:</strong> {recipient}
                </p>

                <p style={{ margin: '0.5rem 0' }}>
                    {msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content}
                </p>

                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                    Sent: {formattedDate}
                </p>
                </div>
            );
            })}
    </>
  );
}

export default SentMsg;