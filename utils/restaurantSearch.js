// Oh-Delivery Feature 21: Restaurant Search utilities

export function searchRestaurants(restaurants, query) {
  if (!Array.isArray(restaurants)) return [];
  if (!query) return restaurants;
  const term = query.toLowerCase().trim();
  return restaurants.filter(r => {
    const name = (r.name || '').toLowerCase();
    const cuisine = (r.cuisine || '').toLowerCase();
    const address = (r.address || '').toLowerCase();
    return name.includes(term) || cuisine.includes(term) || address.includes(term);
  });
}

export function filterRestaurants(restaurants, filters = {}) {
  if (!Array.isArray(restaurants)) return [];
  return restaurants.filter(r => {
    if (filters.cuisine && r.cuisine !== filters.cuisine) return false;
    if (filters.minRating && (r.rating || 0) < filters.minRating) return false;
    if (filters.maxDeliveryTime && (r.deliveryTime || 0) > filters.maxDeliveryTime) return false;
    if (filters.maxDeliveryFee && (r.deliveryFee || 0) > filters.maxDeliveryFee) return false;
    if (filters.isOpen !== undefined && r.isOpen !== filters.isOpen) return false;
    return true;
  });
}

export function sortRestaurants(restaurants, sortBy = 'rating') {
  if (!Array.isArray(restaurants)) return [];
  const sorted = [...restaurants];
  switch (sortBy) {
    case 'rating': return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'deliveryTime': return sorted.sort((a, b) => (a.deliveryTime || 0) - (b.deliveryTime || 0));
    case 'deliveryFee': return sorted.sort((a, b) => (a.deliveryFee || 0) - (b.deliveryFee || 0));
    case 'name': return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    default: return sorted;
  }
}

export function getCuisineOptions(restaurants) {
  if (!Array.isArray(restaurants)) return [];
  return [...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];
}