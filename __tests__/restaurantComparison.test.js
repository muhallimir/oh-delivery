import { compareRestaurants, getBestRestaurant, getComparisonFields, formatComparisonValue } from '../utils/restaurantComparison';

describe('Restaurant Comparison - Oh-Delivery Feature 19', () => {
  const restaurants = [
    { name: 'Pizza Place', rating: 4.5, deliveryTime: 25, deliveryFee: 2.99, cuisine: 'Italian', priceRange: '$$' },
    { name: 'Burger Joint', rating: 4.0, deliveryTime: 20, deliveryFee: 3.99, cuisine: 'American', priceRange: '$' },
  ];

  test('compareRestaurants returns comparison', () => {
    const comp = compareRestaurants(restaurants);
    expect(comp.count).toBe(2);
    expect(comp.avgRating).toBe(4.25);
  });

  test('compareRestaurants returns null for single', () => {
    expect(compareRestaurants([restaurants[0]])).toBeNull();
  });

  test('getBestRestaurant by rating', () => {
    const best = getBestRestaurant(restaurants, 'rating');
    expect(best.name).toBe('Pizza Place');
  });

  test('getBestRestaurant by delivery time', () => {
    const best = getBestRestaurant(restaurants, 'deliveryTime');
    expect(best.name).toBe('Burger Joint');
  });

  test('getComparisonFields returns fields', () => {
    const fields = getComparisonFields();
    expect(fields).toContain('rating');
    expect(fields).toContain('deliveryTime');
  });

  test('formatComparisonValue formats', () => {
    expect(formatComparisonValue(restaurants[0], 'rating')).toBe('4.5/5');
    expect(formatComparisonValue(restaurants[0], 'deliveryTime')).toBe('25 min');
    expect(formatComparisonValue(restaurants[0], 'deliveryFee')).toBe('$2.99');
  });
});