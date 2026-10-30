import { calculateTip, getTipOptions, calculateCustomTip, calculateTotalWithTip, getTipPercentage, formatTip } from '../utils/tipCalculator';

describe('Tip Calculator - Oh-Delivery Feature 13', () => {
  test('calculateTip calculates correctly', () => {
    expect(calculateTip(100, 15)).toBe(15);
    expect(calculateTip(0, 15)).toBe(0);
  });

  test('getTipOptions returns options', () => {
    const options = getTipOptions();
    expect(options).toContain(15);
    expect(options).toContain(20);
  });

  test('calculateCustomTip calculates', () => {
    expect(calculateCustomTip(100, 20)).toBe(20);
    expect(calculateCustomTip(100, -5)).toBe(0);
  });

  test('calculateTotalWithTip adds all', () => {
    expect(calculateTotalWithTip(100, 5, 15)).toBe(120);
  });

  test('getTipPercentage calculates', () => {
    expect(getTipPercentage(100, 15)).toBe(15);
  });

  test('formatTip formats', () => {
    expect(formatTip(15)).toBe('$15.00');
    expect(formatTip(0)).toBe('$0.00');
  });
});