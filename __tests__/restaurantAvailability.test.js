import { isRestaurantAvailable, getAvailabilityStatus, getAvailabilityColor, getAvailabilityText, filterAvailableRestaurants } from '../utils/restaurantAvailability';

describe('Restaurant Availability - Oh-Delivery Feature 29', () => {
  test('isRestaurantAvailable checks', () => {
    expect(isRestaurantAvailable({ closed: false })).toBe(true);
    expect(isRestaurantAvailable({ closed: true })).toBe(false);
    expect(isRestaurantAvailable({ temporarilyClosed: true })).toBe(false);
  });

  test('getAvailabilityStatus returns status', () => {
    expect(getAvailabilityStatus({ closed: true })).toBe('closed');
    expect(getAvailabilityStatus({ busy: true })).toBe('busy');
    expect(getAvailabilityStatus({})).toBe('open');
  });

  test('getAvailabilityColor returns color', () => {
    expect(getAvailabilityColor('open')).toBe('#16a34a');
    expect(getAvailabilityColor('closed')).toBe('#dc2626');
  });

  test('getAvailabilityText returns text', () => {
    expect(getAvailabilityText('open')).toBe('Open');
    expect(getAvailabilityText('closed')).toBe('Closed');
  });

  test('filterAvailableRestaurants filters', () => {
    const restaurants = [{ closed: false }, { closed: true }];
    expect(filterAvailableRestaurants(restaurants)).toHaveLength(1);
  });
});