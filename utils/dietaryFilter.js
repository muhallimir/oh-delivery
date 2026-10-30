// Oh-Delivery: Dietary Preference Filter utilities - pure functions for TDD

export const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher'];

export function filterByDietary(items, preferences = []) {
  if (!Array.isArray(items)) return [];
  if (!Array.isArray(preferences) || preferences.length === 0) return items;
  return items.filter(item => {
    const itemDietary = item.dietary || [];
    return preferences.every(pref => itemDietary.includes(pref));
  });
}

export function getDietaryLabels(item) {
  if (!item || !Array.isArray(item.dietary)) return [];
  return item.dietary;
}

export function hasAllergen(item, allergen) {
  if (!item || !Array.isArray(item.allergens)) return false;
  return item.allergens.includes(allergen);
}

export function filterByAllergens(items, excludedAllergens = []) {
  if (!Array.isArray(items)) return [];
  if (!Array.isArray(excludedAllergens) || excludedAllergens.length === 0) return items;
  return items.filter(item => {
    const allergens = item.allergens || [];
    return !excludedAllergens.some(a => allergens.includes(a));
  });
}

export function getDietarySummary(preferences) {
  if (!Array.isArray(preferences) || preferences.length === 0) return 'No dietary preferences';
  return preferences.join(', ');
}

export function isDietaryCompatible(item, preferences) {
  if (!item || !Array.isArray(preferences)) return true;
  const itemDietary = item.dietary || [];
  return preferences.every(pref => itemDietary.includes(pref));
}