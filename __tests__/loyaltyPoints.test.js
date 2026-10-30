import { calculatePointsEarned, calculateRedemptionValue, redeemPoints, getLoyaltyTier, getPointsToNextTier, formatPoints, POINTS_PER_DOLLAR, REDEMPTION_RATE } from '../utils/loyaltyPoints';

describe('Loyalty Points - Oh-Delivery Feature 4', () => {
  test('POINTS_PER_DOLLAR is 10', () => {
    expect(POINTS_PER_DOLLAR).toBe(10);
  });

  test('calculatePointsEarned calculates correctly', () => {
    expect(calculatePointsEarned(10)).toBe(100);
    expect(calculatePointsEarned(0)).toBe(0);
  });

  test('calculateRedemptionValue calculates correctly', () => {
    expect(calculateRedemptionValue(100)).toBe(1);
    expect(calculateRedemptionValue(0)).toBe(0);
  });

  test('redeemPoints succeeds with enough points', () => {
    const result = redeemPoints(500, 100);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(400);
    expect(result.value).toBe(1);
  });

  test('redeemPoints fails with insufficient points', () => {
    const result = redeemPoints(50, 100);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Insufficient points');
  });

  test('getLoyaltyTier returns tier', () => {
    expect(getLoyaltyTier(500).name).toBe('Bronze');
    expect(getLoyaltyTier(1500).name).toBe('Silver');
    expect(getLoyaltyTier(6000).name).toBe('Gold');
  });

  test('getPointsToNextTier calculates correctly', () => {
    expect(getPointsToNextTier(500)).toBe(500);
    expect(getPointsToNextTier(1500)).toBe(3500);
    expect(getPointsToNextTier(6000)).toBe(0);
  });

  test('formatPoints formats correctly', () => {
    expect(formatPoints(1000)).toBe('1,000 pts');
  });
});