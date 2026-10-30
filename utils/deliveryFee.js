// Oh-Delivery: Delivery Fee Calculator utilities - pure functions for TDD

export function calculateDeliveryFee(distanceKm, baseFee = 2.99, perKmFee = 0.5) {
  if (!distanceKm || distanceKm <= 0) return baseFee;
  return baseFee + (distanceKm * perKmFee);
}

export function calculateSurgeFee(isPeakHour, multiplier = 1.5) {
  if (!isPeakHour) return 0;
  return multiplier - 1; // additional fee multiplier
}

export function calculateTotalDeliveryFee(distanceKm, isPeakHour = false, baseFee = 2.99, perKmFee = 0.5) {
  const base = calculateDeliveryFee(distanceKm, baseFee, perKmFee);
  const surge = isPeakHour ? base * 0.5 : 0; // 50% surge
  return base + surge;
}

export function isFreeDelivery(orderTotal, freeThreshold = 30) {
  return orderTotal >= freeThreshold;
}

export function getDeliveryFeeBreakdown(distanceKm, orderTotal, isPeakHour = false) {
  const fee = calculateTotalDeliveryFee(distanceKm, isPeakHour);
  const isFree = isFreeDelivery(orderTotal);
  return {
    distanceFee: calculateDeliveryFee(distanceKm),
    surgeFee: isPeakHour ? calculateDeliveryFee(distanceKm) * 0.5 : 0,
    totalFee: isFree ? 0 : fee,
    isFreeDelivery: isFree,
    freeThreshold: 30,
  };
}

export function formatDeliveryFee(fee) {
  if (fee === 0) return 'Free';
  return `$${fee.toFixed(2)}`;
}