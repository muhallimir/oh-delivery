// Oh-Delivery Feature 26: Order History Advanced utilities

export function filterOrders(orders, filters = {}) {
  if (!Array.isArray(orders)) return [];
  return orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.restaurantId && order.restaurantId !== filters.restaurantId) return false;
    if (filters.startDate && new Date(order.createdAt) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(order.createdAt) > new Date(filters.endDate)) return false;
    if (filters.minTotal && (order.total || 0) < filters.minTotal) return false;
    return true;
  });
}

export function getOrderStats(orders) {
  if (!Array.isArray(orders) || orders.length === 0) return null;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrder = totalSpent / orders.length;
  const restaurantCounts = {};
  orders.forEach(o => {
    const r = o.restaurantId || 'unknown';
    restaurantCounts[r] = (restaurantCounts[r] || 0) + 1;
  });
  const mostOrdered = Object.entries(restaurantCounts).sort((a, b) => b[1] - a[1])[0];
  return {
    totalOrders: orders.length,
    totalSpent,
    avgOrder: Math.round(avgOrder * 100) / 100,
    mostOrderedRestaurant: mostOrdered ? mostOrdered[0] : null,
  };
}

export function sortOrders(orders, sortBy = 'recent') {
  if (!Array.isArray(orders)) return [];
  const sorted = [...orders];
  if (sortBy === 'recent') sorted.sort((a, b) => b.createdAt - a.createdAt);
  if (sortBy === 'oldest') sorted.sort((a, b) => a.createdAt - b.createdAt);
  if (sortBy === 'total_high') sorted.sort((a, b) => (b.total || 0) - (a.total || 0));
  if (sortBy === 'total_low') sorted.sort((a, b) => (a.total || 0) - (b.total || 0));
  return sorted;
}

export function getOrdersByStatus(orders, status) {
  if (!Array.isArray(orders)) return [];
  return orders.filter(o => o.status === status);
}