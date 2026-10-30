import { getLiveTrackingData, getTrackingProgress, formatDriverLocation, getTrackingUpdateMessage, shouldShowMap } from '../utils/deliveryTrackingAdv';

describe('Delivery Tracking Advanced - Oh-Delivery Feature 30', () => {
  test('getLiveTrackingData returns data', () => {
    const order = { _id: '1', status: 'on_the_way', distance: 3 };
    const data = getLiveTrackingData(order);
    expect(data.orderId).toBe('1');
    expect(data.status).toBe('on_the_way');
  });

  test('getLiveTrackingData handles null', () => {
    expect(getLiveTrackingData(null)).toBeNull();
  });

  test('getTrackingProgress returns progress', () => {
    expect(getTrackingProgress('delivered')).toBe(100);
    expect(getTrackingProgress('preparing')).toBe(40);
  });

  test('formatDriverLocation formats', () => {
    expect(formatDriverLocation({ lat: 40.7128, lng: -74.006 })).toBe('40.7128, -74.0060');
  });

  test('getTrackingUpdateMessage returns message', () => {
    expect(getTrackingUpdateMessage('delivered')).toBe('Order delivered! Enjoy your meal');
  });

  test('shouldShowMap checks status', () => {
    expect(shouldShowMap('on_the_way')).toBe(true);
    expect(shouldShowMap('delivered')).toBe(false);
  });
});