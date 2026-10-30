// Oh-Delivery Feature 27: Delivery Notifications utilities

export const NOTIFICATION_TYPES_OD = ['order_confirmed', 'preparing', 'picked_up', 'on_the_way', 'delivered', 'cancelled', 'promo'];

export function createDeliveryNotification(type, orderId, message) {
  if (!NOTIFICATION_TYPES_OD.includes(type)) return null;
  return {
    id: `notif-${Date.now()}`,
    type,
    orderId,
    message: message || getDefaultMessage(type),
    read: false,
    createdAt: Date.now(),
  };
}

export function getDefaultMessage(type) {
  const messages = {
    order_confirmed: 'Your order has been confirmed!',
    preparing: 'Your order is being prepared',
    picked_up: 'Driver picked up your order',
    on_the_way: 'Your order is on the way',
    delivered: 'Your order has been delivered!',
    cancelled: 'Your order has been cancelled',
    promo: 'New promo available!',
  };
  return messages[type] || 'Order update';
}

export function getUnreadDeliveryNotifications(notifications) {
  if (!Array.isArray(notifications)) return [];
  return notifications.filter(n => !n.read);
}

export function markDeliveryNotificationRead(notification) {
  if (!notification) return null;
  return { ...notification, read: true, readAt: Date.now() };
}

export function getNotificationIconOD(type) {
  const icons = {
    order_confirmed: '✅',
    preparing: '👨‍🍳',
    picked_up: '🛵',
    on_the_way: '🗺️',
    delivered: '📦',
    cancelled: '❌',
    promo: '🎉',
  };
  return icons[type] || '📋';
}