import { useState } from 'react';
import { createMessage } from '../api/messages';
import type { AxiosError } from 'axios';

interface Props {
  recipientId: number;
  recipientName?: string;
  onMessageSent?: () => void;
}

const SendMessageForm = ({ recipientId, recipientName, onMessageSent }: Props) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      return setError('Message content is required');
    }

    try {
      await createMessage({ recipientId, content });
      setSuccess(true);
      setContent('');
      setError(null);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      setError(error.response?.data?.msg || 'Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
      <h3>Send Message to {recipientName || `User #${recipientId}`}</h3>

      <textarea
        placeholder="Enter your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: '100%' }}
      />

      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      {success && (
        <p style={{ color: 'green', marginTop: '0.5rem' }}>Message sent successfully!</p>
      )}

      <button type="submit" className="button-green" style={{ marginTop: '1rem' }}>
        Send
      </button>
    </form>
  );
};

export default SendMessageForm;