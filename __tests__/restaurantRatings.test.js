import { getRatingBreakdown, getRatingPercentage, getAverageDeliveryRating, getTopRatedRestaurants, getRatingLabel } from '../utils/restaurantRatings';

describe('Restaurant Ratings - Oh-Delivery Feature 25', () => {
  const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 3 }];

  test('getRatingBreakdown returns breakdown', () => {
    const breakdown = getRatingBreakdown(reviews);
    expect(breakdown[5]).toBe(2);
    expect(breakdown[4]).toBe(1);
  });

  test('getRatingPercentage calculates', () => {
    expect(getRatingPercentage(reviews, 5)).toBe(50);
  });

  test('getAverageDeliveryRating calculates', () => {
    const reviewsWithDelivery = [{ deliveryRating: 4 }, { deliveryRating: 5 }];
    expect(getAverageDeliveryRating(reviewsWithDelivery)).toBe(4.5);
  });

  test('getTopRatedRestaurants sorts', () => {
    const restaurants = [{ rating: 4.5 }, { rating: 3.0 }];
    const top = getTopRatedRestaurants(restaurants, 1);
    expect(top[0].rating).toBe(4.5);
  });

  test('getRatingLabel returns label', () => {
    expect(getRatingLabel(4.8)).toBe('Excellent');
    expect(getRatingLabel(4.2)).toBe('Very Good');
    expect(getRatingLabel(3.0)).toBe('Average');
  });
});