import { getDeliveryStatus, calculateETA, formatETA, getDeliveryProgress, isDeliveryActive, getDriverInfo } from '../utils/deliveryTracking';

describe('Delivery Tracking - Oh-Delivery Feature 1', () => {
  test('getDeliveryStatus returns status', () => {
    const s = getDeliveryStatus('preparing');
    expect(s.text).toBe('Preparing your order');
    expect(s.progress).toBe(20);
  });

  test('getDeliveryStatus handles unknown', () => {
    const s = getDeliveryStatus('unknown');
    expect(s.text).toBe('Unknown');
  });

  test('calculateETA calculates correctly', () => {
    expect(calculateETA(10, 30)).toBe(20);
    expect(calculateETA(0)).toBe(0);
  });

  test('formatETA formats correctly', () => {
    expect(formatETA(5)).toBe('5 min');
    expect(formatETA(90)).toBe('1h 30m');
    expect(formatETA(0)).toBe('Arriving now');
  });

  test('getDeliveryProgress returns progress', () => {
    expect(getDeliveryProgress('delivered')).toBe(100);
  });

  test('isDeliveryActive checks active', () => {
    expect(isDeliveryActive('on_the_way')).toBe(true);
    expect(isDeliveryActive('delivered')).toBe(false);
  });

  test('getDriverInfo returns info', () => {
    const info = getDriverInfo({ driver: { name: 'John', rating: 4.8 } });
    expect(info.name).toBe('John');
    expect(info.rating).toBe(4.8);
  });

  test('getDriverInfo handles null', () => {
    expect(getDriverInfo(null)).toBeNull();
    expect(getDriverInfo({})).toBeNull();
  });
});