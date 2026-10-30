// Oh-Delivery Feature 19: Restaurant Comparison utilities

export function compareRestaurants(restaurants) {
  if (!Array.isArray(restaurants) || restaurants.length < 2) return null;
  return {
    count: restaurants.length,
    avgRating: restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.length,
    avgDeliveryTime: restaurants.reduce((sum, r) => sum + (r.deliveryTime || 0), 0) / restaurants.length,
    avgDeliveryFee: restaurants.reduce((sum, r) => sum + (r.deliveryFee || 0), 0) / restaurants.length,
    priceRanges: restaurants.map(r => r.priceRange || '$$'),
    cuisines: [...new Set(restaurants.map(r => r.cuisine).filter(Boolean))],
  };
}

export function getBestRestaurant(restaurants, criteria = 'rating') {
  if (!Array.isArray(restaurants) || restaurants.length === 0) return null;
  if (criteria === 'rating') {
    return restaurants.reduce((best, r) => (r.rating || 0) > (best.rating || 0) ? r : best);
  }
  if (criteria === 'deliveryTime') {
    return restaurants.reduce((best, r) => (r.deliveryTime || Infinity) < (best.deliveryTime || Infinity) ? r : best);
  }
  if (criteria === 'deliveryFee') {
    return restaurants.reduce((best, r) => (r.deliveryFee || Infinity) < (best.deliveryFee || Infinity) ? r : best);
  }
  return restaurants[0];
}

export function getComparisonFields() {
  return ['name', 'rating', 'deliveryTime', 'deliveryFee', 'cuisine', 'priceRange'];
}

export function formatComparisonValue(restaurant, field) {
  if (!restaurant) return 'N/A';
  const val = restaurant[field];
  if (val === undefined || val === null) return 'N/A';
  if (field === 'rating') return `${val}/5`;
  if (field === 'deliveryTime') return `${val} min`;
  if (field === 'deliveryFee') return `$${val.toFixed(2)}`;
  return String(val);
}