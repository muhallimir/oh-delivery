import { addFavorite, removeFavorite, isFavorite, getFavoriteRestaurants, getFavoriteCount, toggleFavorite } from '../utils/favoriteRestaurants';

describe('Favorite Restaurants - Oh-Delivery Feature 6', () => {
  test('addFavorite adds restaurant', () => {
    const result = addFavorite([], 'rest1');
    expect(result).toContain('rest1');
  });

  test('addFavorite does not duplicate', () => {
    const result = addFavorite(['rest1'], 'rest1');
    expect(result).toHaveLength(1);
  });

  test('removeFavorite removes restaurant', () => {
    const result = removeFavorite(['rest1', 'rest2'], 'rest1');
    expect(result).not.toContain('rest1');
  });

  test('isFavorite checks membership', () => {
    expect(isFavorite(['rest1'], 'rest1')).toBe(true);
    expect(isFavorite(['rest1'], 'rest2')).toBe(false);
  });

  test('getFavoriteRestaurants filters', () => {
    const restaurants = [{ _id: 'r1' }, { _id: 'r2' }];
    const result = getFavoriteRestaurants(restaurants, ['r1']);
    expect(result).toHaveLength(1);
  });

  test('getFavoriteCount returns count', () => {
    expect(getFavoriteCount(['r1', 'r2'])).toBe(2);
    expect(getFavoriteCount(null)).toBe(0);
  });

  test('toggleFavorite toggles', () => {
    const added = toggleFavorite([], 'r1');
    expect(added).toContain('r1');
    const removed = toggleFavorite(added, 'r1');
    expect(removed).not.toContain('r1');
  });
});