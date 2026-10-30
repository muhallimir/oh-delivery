import { createDeliveryNotification, getDefaultMessage, getUnreadDeliveryNotifications, markDeliveryNotificationRead, getNotificationIconOD } from '../utils/deliveryNotifications';

describe('Delivery Notifications - Oh-Delivery Feature 27', () => {
  test('createDeliveryNotification creates notification', () => {
    const notif = createDeliveryNotification('delivered', 'order1');
    expect(notif).not.toBeNull();
    expect(notif.type).toBe('delivered');
  });

  test('createDeliveryNotification rejects invalid type', () => {
    expect(createDeliveryNotification('invalid', 'order1')).toBeNull();
  });

  test('getDefaultMessage returns message', () => {
    expect(getDefaultMessage('delivered')).toBe('Your order has been delivered!');
  });

  test('getUnreadDeliveryNotifications filters', () => {
    const notifs = [{ read: false }, { read: true }];
    expect(getUnreadDeliveryNotifications(notifs)).toHaveLength(1);
  });

  test('markDeliveryNotificationRead marks read', () => {
    const notif = { read: false };
    const result = markDeliveryNotificationRead(notif);
    expect(result.read).toBe(true);
  });

  test('getNotificationIconOD returns icon', () => {
    expect(getNotificationIconOD('delivered')).toBe('📦');
  });
});