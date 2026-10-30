import { searchRestaurants, filterRestaurants, sortRestaurants, getCuisineOptions } from '../utils/restaurantSearch';

describe('Restaurant Search - Oh-Delivery Feature 21', () => {
  const restaurants = [
    { _id: '1', name: 'Pizza Place', cuisine: 'Italian', rating: 4.5, deliveryTime: 25, deliveryFee: 2.99, isOpen: true },
    { _id: '2', name: 'Burger Joint', cuisine: 'American', rating: 4.0, deliveryTime: 20, deliveryFee: 3.99, isOpen: true },
  ];

  test('searchRestaurants searches by name', () => {
    expect(searchRestaurants(restaurants, 'pizza')).toHaveLength(1);
  });

  test('searchRestaurants searches by cuisine', () => {
    expect(searchRestaurants(restaurants, 'italian')).toHaveLength(1);
  });

  test('filterRestaurants filters by rating', () => {
    expect(filterRestaurants(restaurants, { minRating: 4.5 })).toHaveLength(1);
  });

  test('filterRestaurants filters by delivery time', () => {
    expect(filterRestaurants(restaurants, { maxDeliveryTime: 20 })).toHaveLength(1);
  });

  test('sortRestaurants sorts by rating', () => {
    const sorted = sortRestaurants(restaurants, 'rating');
    expect(sorted[0]._id).toBe('1');
  });

  test('getCuisineOptions returns cuisines', () => {
    expect(getCuisineOptions(restaurants)).toContain('Italian');
  });
});