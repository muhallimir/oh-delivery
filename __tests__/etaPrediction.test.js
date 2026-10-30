import { predictETA, getConfidence, formatETA, getETARange } from '../utils/etaPrediction';

describe('ETA Prediction - Oh-Delivery Feature 20', () => {
  test('predictETA predicts correctly', () => {
    const eta = predictETA({ id: '1' }, { basePrepTime: 15, distance: 3, driverSpeed: 25 });
    expect(eta).not.toBeNull();
    expect(eta.estimatedMinutes).toBeGreaterThan(0);
    expect(eta.prepTime).toBe(15);
  });

  test('predictETA handles null', () => {
    expect(predictETA(null)).toBeNull();
  });

  test('getConfidence returns confidence', () => {
    const conf = getConfidence({ distance: 3 });
    expect(conf).toBeGreaterThanOrEqual(50);
    expect(conf).toBeLessThanOrEqual(99);
  });

  test('formatETA formats correctly', () => {
    expect(formatETA({ estimatedMinutes: 25 })).toBe('25 min');
    expect(formatETA({ estimatedMinutes: 90 })).toBe('1h 30m');
  });

  test('getETARange returns range', () => {
    const range = getETARange({ estimatedMinutes: 30 });
    expect(range).toBe('25-40 min');
  });
});