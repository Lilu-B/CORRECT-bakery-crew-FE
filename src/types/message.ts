export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  senderName?: string;
  receiverName?: string;
  content: string;
  sentDate: string;
  isRead: boolean;
  messageType: 'personal' | 'system';
  relatedEntityId?: number | null;
  relatedEntityType?: 'event' | 'donation' | null;
}

// export interface Message {
//   id: number;
//   sender_id: number;
//   receiver_id: number;
//   sender_name?: string;
//   receiver_name?: string;
//   content: string;
//   sent_date: string;
//   is_read: boolean;
//   message_type: 'personal' | 'system';
//   related_entity_id?: number | null;
//   related_entity_type?: 'event' | 'donation' | null;
// }