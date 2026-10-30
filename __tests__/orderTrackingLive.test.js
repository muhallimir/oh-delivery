import { getTrackingSteps, getCurrentStepIndex, getTrackingProgress, getNextStep, isTrackingComplete, getEstimatedArrival } from '../utils/orderTrackingLive';

describe('Order Tracking Live - Oh-Delivery Feature 22', () => {
  test('getTrackingSteps returns steps', () => {
    expect(getTrackingSteps()).toHaveLength(6);
  });

  test('getCurrentStepIndex returns index', () => {
    expect(getCurrentStepIndex('preparing')).toBe(2);
  });

  test('getTrackingProgress returns progress', () => {
    expect(getTrackingProgress('delivered')).toBe(100);
  });

  test('getNextStep returns next', () => {
    const next = getNextStep('preparing');
    expect(next.id).toBe('picked_up');
  });

  test('isTrackingComplete checks', () => {
    expect(isTrackingComplete('delivered')).toBe(true);
    expect(isTrackingComplete('preparing')).toBe(false);
  });

  test('getEstimatedArrival returns remaining', () => {
    const order = { estimatedDeliveryTime: 30, elapsedMinutes: 10 };
    expect(getEstimatedArrival(order)).toBe(20);
  });
});