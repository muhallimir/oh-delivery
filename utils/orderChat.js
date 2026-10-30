// Oh-Delivery: Order Chat utilities - pure functions for TDD

export function createMessage(sender, text, orderId) {
  if (!sender || !text || !orderId) return null;
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    sender,
    text: text.trim(),
    orderId,
    timestamp: Date.now(),
    read: false,
  };
}

export function getChatMessages(messages, orderId) {
  if (!Array.isArray(messages)) return [];
  return messages.filter(m => m.orderId === orderId).sort((a, b) => a.timestamp - b.timestamp);
}

export function markAsRead(messages, messageId) {
  if (!Array.isArray(messages)) return [];
  return messages.map(m => m.id === messageId ? { ...m, read: true } : m);
}

export function getUnreadCount(messages, orderId, recipient) {
  if (!Array.isArray(messages)) return 0;
  return messages.filter(m => m.orderId === orderId && m.sender !== recipient && !m.read).length;
}

export function formatMessageTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getQuickReplies() {
  return [
    'Where is my order?',
    'How long will it take?',
    'Can you leave at the door?',
    'I have a special instruction',
    'Thank you!',
  ];
}