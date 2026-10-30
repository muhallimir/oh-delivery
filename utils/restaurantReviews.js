// Oh-Delivery: Restaurant Reviews utilities - pure functions for TDD

export function createReview(restaurantId, userId, rating, comment, photos = []) {
  if (!restaurantId || !userId || !rating || rating < 1 || rating > 5) return null;
  return {
    id: `review-${Date.now()}`,
    restaurantId,
    userId,
    rating,
    comment: (comment || '').trim(),
    photos: Array.isArray(photos) ? photos : [],
    createdAt: Date.now(),
    helpful: 0,
  };
}

export function getAverageRating(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const sum = reviews.reduce((a, r) => a + (r.rating || 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getRatingDistribution(reviews) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (!Array.isArray(reviews)) return dist;
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) dist[r.rating]++;
  });
  return dist;
}

export function sortReviews(reviews, sortBy = 'recent') {
  if (!Array.isArray(reviews)) return [];
  const sorted = [...reviews];
  if (sortBy === 'recent') sorted.sort((a, b) => b.createdAt - a.createdAt);
  if (sortBy === 'rating_high') sorted.sort((a, b) => b.rating - a.rating);
  if (sortBy === 'rating_low') sorted.sort((a, b) => a.rating - b.rating);
  if (sortBy === 'helpful') sorted.sort((a, b) => b.helpful - a.helpful);
  return sorted;
}

export function markHelpful(review) {
  if (!review) return null;
  return { ...review, helpful: (review.helpful || 0) + 1 };
}

export function getReviewSummary(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 'No reviews yet';
  const avg = getAverageRating(reviews);
  return `${avg}/5 (${reviews.length} reviews)`;
}