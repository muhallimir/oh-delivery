import { createReview, getAverageRating, getRatingDistribution, sortReviews, markHelpful, getReviewSummary } from '../utils/restaurantReviews';

describe('Restaurant Reviews - Oh-Delivery Feature 5', () => {
  test('createReview creates review', () => {
    const review = createReview('rest1', 'user1', 4, 'Great food!', ['img.jpg']);
    expect(review).not.toBeNull();
    expect(review.rating).toBe(4);
    expect(review.photos).toHaveLength(1);
  });

  test('createReview rejects invalid rating', () => {
    expect(createReview('rest1', 'user1', 0, 'Bad')).toBeNull();
    expect(createReview('rest1', 'user1', 6, 'Bad')).toBeNull();
    expect(createReview('rest1', null, 4, 'Bad')).toBeNull();
  });

  test('getAverageRating calculates average', () => {
    const reviews = [{ rating: 4 }, { rating: 5 }, { rating: 3 }];
    expect(getAverageRating(reviews)).toBe(4);
  });

  test('getAverageRating handles empty', () => {
    expect(getAverageRating([])).toBe(0);
    expect(getAverageRating(null)).toBe(0);
  });

  test('getRatingDistribution returns distribution', () => {
    const reviews = [{ rating: 5 }, { rating: 5 }, { rating: 3 }];
    const dist = getRatingDistribution(reviews);
    expect(dist[5]).toBe(2);
    expect(dist[3]).toBe(1);
  });

  test('sortReviews sorts by recent', () => {
    const reviews = [{ createdAt: 100 }, { createdAt: 200 }];
    const sorted = sortReviews(reviews, 'recent');
    expect(sorted[0].createdAt).toBe(200);
  });

  test('markHelpful increments', () => {
    const review = { helpful: 5 };
    const result = markHelpful(review);
    expect(result.helpful).toBe(6);
  });

  test('getReviewSummary formats', () => {
    const reviews = [{ rating: 4 }, { rating: 5 }];
    expect(getReviewSummary(reviews)).toBe('4.5/5 (2 reviews)');
    expect(getReviewSummary([])).toBe('No reviews yet');
  });
});