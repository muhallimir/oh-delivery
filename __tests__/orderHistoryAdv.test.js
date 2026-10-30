import { filterOrders, getOrderStats, sortOrders, getOrdersByStatus } from '../utils/orderHistoryAdv';

describe('Order History Advanced - Oh-Delivery Feature 26', () => {
  const orders = [
    { _id: '1', status: 'delivered', restaurantId: 'r1', total: 25, createdAt: 1000 },
    { _id: '2', status: 'pending', restaurantId: 'r2', total: 15, createdAt: 2000 },
    { _id: '3', status: 'delivered', restaurantId: 'r1', total: 30, createdAt: 3000 },
  ];

  test('filterOrders filters by status', () => {
    expect(filterOrders(orders, { status: 'delivered' })).toHaveLength(2);
  });

  test('filterOrders filters by restaurant', () => {
    expect(filterOrders(orders, { restaurantId: 'r1' })).toHaveLength(2);
  });

  test('getOrderStats returns stats', () => {
    const stats = getOrderStats(orders);
    expect(stats.totalOrders).toBe(3);
    expect(stats.totalSpent).toBe(70);
  });

  test('sortOrders sorts by recent', () => {
    const sorted = sortOrders(orders, 'recent');
    expect(sorted[0]._id).toBe('3');
  });

  test('getOrdersByStatus filters', () => {
    expect(getOrdersByStatus(orders, 'pending')).toHaveLength(1);
  });
});