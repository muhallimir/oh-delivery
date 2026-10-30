// Oh-Delivery: Loyalty Points utilities - pure functions for TDD

export const POINTS_PER_DOLLAR = 10;
export const REDEMPTION_RATE = 100; // 100 points = $1

export function calculatePointsEarned(orderTotal) {
  if (!orderTotal || orderTotal <= 0) return 0;
  return Math.floor(orderTotal * POINTS_PER_DOLLAR);
}

export function calculateRedemptionValue(points) {
  if (!points || points <= 0) return 0;
  return points / REDEMPTION_RATE;
}

export function redeemPoints(currentPoints, pointsToRedeem) {
  if (pointsToRedeem > currentPoints) return { success: false, error: 'Insufficient points' };
  if (pointsToRedeem <= 0) return { success: false, error: 'Invalid amount' };
  return { success: true, remaining: currentPoints - pointsToRedeem, value: calculateRedemptionValue(pointsToRedeem) };
}

export function getLoyaltyTier(totalPoints) {
  if (totalPoints >= 5000) return { name: 'Gold', multiplier: 1.5, color: '#f59e0b' };
  if (totalPoints >= 1000) return { name: 'Silver', multiplier: 1.25, color: '#9ca3af' };
  return { name: 'Bronze', multiplier: 1.0, color: '#cd7f32' };
}

export function getPointsToNextTier(currentPoints) {
  if (currentPoints >= 5000) return 0;
  if (currentPoints >= 1000) return 5000 - currentPoints;
  return 1000 - currentPoints;
}

export function formatPoints(points) {
  return `${points.toLocaleString()} pts`;
}