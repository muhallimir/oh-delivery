import { createMessage, getChatMessages, markAsRead, getUnreadCount, formatMessageTime, getQuickReplies } from '../utils/orderChat';

describe('Order Chat - Oh-Delivery Feature 9', () => {
  test('createMessage creates message', () => {
    const msg = createMessage('driver', 'On my way!', 'order1');
    expect(msg).not.toBeNull();
    expect(msg.sender).toBe('driver');
    expect(msg.text).toBe('On my way!');
    expect(msg.read).toBe(false);
  });

  test('createMessage rejects invalid', () => {
    expect(createMessage(null, 'text', 'order1')).toBeNull();
    expect(createMessage('driver', '', 'order1')).toBeNull();
    expect(createMessage('driver', 'text', null)).toBeNull();
  });

  test('getChatMessages filters by order', () => {
    const msgs = [
      { id: '1', orderId: 'order1', timestamp: 100 },
      { id: '2', orderId: 'order2', timestamp: 200 },
    ];
    const result = getChatMessages(msgs, 'order1');
    expect(result).toHaveLength(1);
  });

  test('markAsRead marks message', () => {
    const msgs = [{ id: '1', read: false }];
    const result = markAsRead(msgs, '1');
    expect(result[0].read).toBe(true);
  });

  test('getUnreadCount counts unread', () => {
    const msgs = [
      { id: '1', orderId: 'order1', sender: 'driver', read: false },
      { id: '2', orderId: 'order1', sender: 'customer', read: false },
    ];
    expect(getUnreadCount(msgs, 'order1', 'customer')).toBe(1);
  });

  test('formatMessageTime formats', () => {
    expect(formatMessageTime(Date.now())).toBeTruthy();
    expect(formatMessageTime(null)).toBe('');
  });

  test('getQuickReplies returns array', () => {
    const replies = getQuickReplies();
    expect(Array.isArray(replies)).toBe(true);
    expect(replies.length).toBeGreaterThan(0);
  });
});