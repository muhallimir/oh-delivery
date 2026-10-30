// Oh-Delivery Feature 25: Restaurant Ratings utilities

export function getRatingBreakdown(reviews) {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (!Array.isArray(reviews)) return breakdown;
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) breakdown[r.rating]++;
  });
  return breakdown;
}

export function getRatingPercentage(reviews, rating) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const count = reviews.filter(r => r.rating === rating).length;
  return Math.round((count / reviews.length) * 100);
}

export function getAverageDeliveryRating(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const sum = reviews.reduce((a, r) => a + (r.deliveryRating || 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getTopRatedRestaurants(restaurants, limit = 5) {
  if (!Array.isArray(restaurants)) return [];
  return [...restaurants]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

export function getRatingLabel(rating) {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Average';
  return 'Below Average';
}