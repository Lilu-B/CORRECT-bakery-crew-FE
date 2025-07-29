import api from './axios';
import type { Message } from '../types/message';

export const fetchInboxMessages = async (): Promise<Message[]> => {
  const res = await api.get('/messages/inbox');
  return res.data.inbox;
};

export const fetchSentMessages = async (): Promise<Message[]> => {
  const res = await api.get('/messages/sent');
  return res.data.sent;
};

export const fetchMessageById = async (id: number): Promise<Message> => {
  const res = await api.get(`/messages/${id}`);
  return res.data.message;
};

export const markMessageAsRead = async (id: number): Promise<{ msg: string }> => {
  const res = await api.patch(`/messages/${id}/read`);
  return res.data;
};

// export const deleteMessage = async (messageId: number): Promise<{ msg: string; messageId: number }> => {
//   const res = await api.delete(`/messages/${messageId}`);
//   return res.data;
// };

export const createMessage = async (
  payload: {
    recipientId: number;
    content: string;
    message_type?: 'personal' | 'system';
    related_entity_id?: number;
    related_entity_type?: 'event' | 'donation' | 'user';
  }
): Promise<{ msg: string; message: Message }> => {
  const res = await api.post('/messages', payload);
  return res.data;
};