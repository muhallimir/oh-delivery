import { calculateDeliveryFee, calculateTotalDeliveryFee, isFreeDelivery, getDeliveryFeeBreakdown, formatDeliveryFee } from '../utils/deliveryFee';

describe('Delivery Fee - Oh-Delivery Feature 8', () => {
  test('calculateDeliveryFee calculates correctly', () => {
    expect(calculateDeliveryFee(5, 2.99, 0.5)).toBe(5.49);
    expect(calculateDeliveryFee(0, 2.99, 0.5)).toBe(2.99);
  });

  test('calculateTotalDeliveryFee adds surge', () => {
    const fee = calculateTotalDeliveryFee(5, true);
    expect(fee).toBeGreaterThan(calculateDeliveryFee(5));
  });

  test('isFreeDelivery checks threshold', () => {
    expect(isFreeDelivery(35)).toBe(true);
    expect(isFreeDelivery(25)).toBe(false);
  });

  test('getDeliveryFeeBreakdown returns breakdown', () => {
    const breakdown = getDeliveryFeeBreakdown(5, 25, false);
    expect(breakdown.isFreeDelivery).toBe(false);
    expect(breakdown.totalFee).toBeGreaterThan(0);
  });

  test('getDeliveryFeeBreakdown free delivery', () => {
    const breakdown = getDeliveryFeeBreakdown(5, 35, false);
    expect(breakdown.isFreeDelivery).toBe(true);
    expect(breakdown.totalFee).toBe(0);
  });

  test('formatDeliveryFee formats correctly', () => {
    expect(formatDeliveryFee(0)).toBe('Free');
    expect(formatDeliveryFee(5.49)).toBe('$5.49');
  });
});