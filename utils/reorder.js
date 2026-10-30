// Oh-Delivery: Reorder utilities - pure functions for TDD

export function canReorderOrder(order) {
  if (!order) return false;
  const status = (order.status || '').toLowerCase();
  return ['delivered', 'completed'].includes(status);
}

export function getReorderCartItems(order) {
  if (!order || !Array.isArray(order.items)) return [];
  return order.items.map(item => ({
    dishId: item.dishId || item._id,
    name: item.name,
    quantity: item.quantity || 1,
    price: item.price,
    restaurantId: order.restaurantId,
  }));
}

export function getReorderTotal(order) {
  if (!order || !Array.isArray(order.items)) return 0;
  return order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
}

export function isReorderable(order) {
  return canReorderOrder(order) && getReorderCartItems(order).length > 0;
}

export function formatReorderSummary(order) {
  if (!order) return '';
  const items = getReorderCartItems(order);
  const total = getReorderTotal(order);
  return `Reorder ${items.length} item(s) for $${total.toFixed(2)}`;
}