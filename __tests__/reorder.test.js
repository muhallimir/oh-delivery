import { canReorderOrder, getReorderCartItems, getReorderTotal, isReorderable, formatReorderSummary } from '../utils/reorder';

describe('Reorder - Oh-Delivery Feature 7', () => {
  const order = {
    status: 'delivered',
    restaurantId: 'rest1',
    items: [
      { dishId: 'd1', name: 'Pizza', quantity: 2, price: 15 },
      { dishId: 'd2', name: 'Pasta', quantity: 1, price: 12 },
    ],
  };

  test('canReorderOrder returns true for delivered', () => {
    expect(canReorderOrder({ status: 'delivered' })).toBe(true);
    expect(canReorderOrder({ status: 'completed' })).toBe(true);
  });

  test('canReorderOrder returns false for pending', () => {
    expect(canReorderOrder({ status: 'pending' })).toBe(false);
    expect(canReorderOrder(null)).toBe(false);
  });

  test('getReorderCartItems returns items', () => {
    const items = getReorderCartItems(order);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Pizza');
    expect(items[0].restaurantId).toBe('rest1');
  });

  test('getReorderTotal calculates correctly', () => {
    expect(getReorderTotal(order)).toBe(42); // 15*2 + 12*1
  });

  test('isReorderable checks all', () => {
    expect(isReorderable(order)).toBe(true);
    expect(isReorderable({ status: 'pending', items: [] })).toBe(false);
  });

  test('formatReorderSummary formats correctly', () => {
    const summary = formatReorderSummary(order);
    expect(summary).toContain('2 item(s)');
    expect(summary).toContain('$42.00');
  });
});