import { addFavoriteDish, removeFavoriteDish, isFavoriteDish, getFavoriteDishes, getFavoriteDishCount, toggleFavoriteDish } from '../utils/favoriteDishes';

describe('Favorite Dishes - Oh-Delivery Feature 17', () => {
  test('addFavoriteDish adds dish', () => {
    const result = addFavoriteDish([], 'dish1');
    expect(result).toContain('dish1');
  });

  test('addFavoriteDish does not duplicate', () => {
    const result = addFavoriteDish(['dish1'], 'dish1');
    expect(result).toHaveLength(1);
  });

  test('removeFavoriteDish removes', () => {
    const result = removeFavoriteDish(['dish1', 'dish2'], 'dish1');
    expect(result).not.toContain('dish1');
  });

  test('isFavoriteDish checks', () => {
    expect(isFavoriteDish(['dish1'], 'dish1')).toBe(true);
    expect(isFavoriteDish(['dish1'], 'dish2')).toBe(false);
  });

  test('getFavoriteDishes filters', () => {
    const dishes = [{ _id: 'd1' }, { _id: 'd2' }];
    const result = getFavoriteDishes(dishes, ['d1']);
    expect(result).toHaveLength(1);
  });

  test('getFavoriteDishCount returns count', () => {
    expect(getFavoriteDishCount(['d1', 'd2'])).toBe(2);
    expect(getFavoriteDishCount(null)).toBe(0);
  });

  test('toggleFavoriteDish toggles', () => {
    const added = toggleFavoriteDish([], 'd1');
    expect(added).toContain('d1');
    const removed = toggleFavoriteDish(added, 'd1');
    expect(removed).not.toContain('d1');
  });
});