import { filterByDietary, getDietaryLabels, hasAllergen, filterByAllergens, getDietarySummary, isDietaryCompatible, DIETARY_OPTIONS } from '../utils/dietaryFilter';

describe('Dietary Filter - Oh-Delivery Feature 10', () => {
  const items = [
    { _id: '1', name: 'Salad', dietary: ['vegetarian', 'vegan'], allergens: [] },
    { _id: '2', name: 'Burger', dietary: [], allergens: ['gluten'] },
    { _id: '3', name: 'Pizza', dietary: ['vegetarian'], allergens: ['dairy', 'gluten'] },
  ];

  test('DIETARY_OPTIONS includes options', () => {
    expect(DIETARY_OPTIONS).toContain('vegan');
    expect(DIETARY_OPTIONS).toContain('gluten-free');
  });

  test('filterByDietary filters correctly', () => {
    const result = filterByDietary(items, ['vegan']);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('1');
  });

  test('filterByDietary returns all for empty prefs', () => {
    expect(filterByDietary(items, [])).toHaveLength(3);
  });

  test('getDietaryLabels returns labels', () => {
    expect(getDietaryLabels(items[0])).toEqual(['vegetarian', 'vegan']);
  });

  test('hasAllergen checks allergen', () => {
    expect(hasAllergen(items[1], 'gluten')).toBe(true);
    expect(hasAllergen(items[0], 'gluten')).toBe(false);
  });

  test('filterByAllergens excludes allergens', () => {
    const result = filterByAllergens(items, ['gluten']);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('1');
  });

  test('getDietarySummary formats', () => {
    expect(getDietarySummary(['vegan', 'gluten-free'])).toBe('vegan, gluten-free');
    expect(getDietarySummary([])).toBe('No dietary preferences');
  });

  test('isDietaryCompatible checks compatibility', () => {
    expect(isDietaryCompatible(items[0], ['vegan'])).toBe(true);
    expect(isDietaryCompatible(items[1], ['vegan'])).toBe(false);
  });
});