import { splitOrder, splitByItems, calculateSplitTotal, formatSplitSummary } from '../utils/orderSplitting';

describe('Order Splitting - Oh-Delivery Feature 14', () => {
  const items = [{ name: 'Pizza', price: 15, quantity: 2 }, { name: 'Pasta', price: 12, quantity: 1 }];

  test('splitOrder splits evenly', () => {
    const splits = splitOrder(items, 2);
    expect(splits).toHaveLength(2);
    expect(splits[0].amount).toBe(21); // (15*2 + 12)/2
  });

  test('splitOrder handles invalid', () => {
    expect(splitOrder(items, 0)).toEqual([]);
    expect(splitOrder(null, 2)).toEqual([]);
  });

  test('calculateSplitTotal sums amounts', () => {
    const splits = splitOrder(items, 2);
    expect(calculateSplitTotal(splits)).toBe(42);
  });

  test('formatSplitSummary formats', () => {
    const splits = splitOrder(items, 2);
    const summary = formatSplitSummary(splits);
    expect(summary).toContain('Person 1');
  });
});