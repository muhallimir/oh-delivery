import { isWithinDeliveryZone, calculateDistance, getDeliveryZone, getZoneDeliveryFee, getAvailableZones } from '../utils/deliveryZones';

describe('Delivery Zones - Oh-Delivery Feature 11', () => {
  const zones = [
    { id: 'z1', center: { lat: 40.7, lng: -74.0 }, radius: 5, deliveryFee: 2.99, active: true },
    { id: 'z2', center: { lat: 40.8, lng: -73.9 }, radius: 3, deliveryFee: 3.99, active: true },
  ];

  test('calculateDistance calculates', () => {
    const dist = calculateDistance({ lat: 40.7, lng: -74.0 }, { lat: 40.8, lng: -73.9 });
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(20);
  });

  test('isWithinDeliveryZone checks', () => {
    expect(isWithinDeliveryZone({ lat: 40.7, lng: -74.0 }, zones)).toBe(true);
    expect(isWithinDeliveryZone({ lat: 50, lng: -74 }, zones)).toBe(false);
  });

  test('getDeliveryZone returns zone', () => {
    const zone = getDeliveryZone({ lat: 40.7, lng: -74.0 }, zones);
    expect(zone).not.toBeNull();
    expect(zone.id).toBe('z1');
  });

  test('getZoneDeliveryFee returns fee', () => {
    expect(getZoneDeliveryFee(zones[0])).toBe(2.99);
  });

  test('getAvailableZones filters', () => {
    const zonesWithInactive = [...zones, { id: 'z3', active: false }];
    expect(getAvailableZones(zonesWithInactive)).toHaveLength(2);
  });
});