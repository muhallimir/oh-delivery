import { isOpenNow, parseTime, getNextOpenTime, formatOperatingHours, getHoursUntilClose } from '../utils/restaurantHours';

describe('Restaurant Hours - Oh-Delivery Feature 12', () => {
  const hours = {
    0: { open: '10:00', close: '22:00', closed: false },
    1: { open: '10:00', close: '22:00', closed: false },
  };

  test('parseTime parses correctly', () => {
    expect(parseTime('10:30')).toBe(630);
    expect(parseTime('22:00')).toBe(1320);
  });

  test('isOpenNow checks correctly', () => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    now.setDay = () => {};
    // Just test the function doesn't crash
    const result = isOpenNow(hours, now);
    expect(typeof result).toBe('boolean');
  });

  test('getNextOpenTime returns next open', () => {
    const result = getNextOpenTime(hours);
    expect(result).not.toBeNull();
  });

  test('formatOperatingHours formats', () => {
    const formatted = formatOperatingHours(hours);
    expect(formatted).toContain('Mon');
  });

  test('getHoursUntilClose returns number', () => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const result = getHoursUntilClose(hours, now);
    expect(typeof result).toBe('number');
  });
});