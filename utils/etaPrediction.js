// Oh-Delivery Feature 20: Order ETA Prediction utilities

export function predictETA(order, factors = {}) {
  if (!order) return null;
  const baseTime = factors.basePrepTime || 15;
  const distance = factors.distance || 3;
  const trafficMultiplier = factors.trafficMultiplier || 1.0;
  const weatherDelay = factors.weatherDelay || 0;
  const driverSpeed = factors.driverSpeed || 25;

  const prepTime = baseTime + (factors.complexity || 0) * 5;
  const travelTime = (distance / driverSpeed) * 60;
  const totalMinutes = Math.ceil((prepTime + travelTime) * trafficMultiplier + weatherDelay);

  return {
    estimatedMinutes: totalMinutes,
    prepTime,
    travelTime: Math.ceil(travelTime),
    trafficMultiplier,
    weatherDelay,
    confidence: getConfidence(factors),
  };
}

export function getConfidence(factors) {
  let confidence = 80;
  if (factors.trafficMultiplier && factors.trafficMultiplier > 1.2) confidence -= 10;
  if (factors.weatherDelay && factors.weatherDelay > 5) confidence -= 15;
  if (factors.distance && factors.distance > 10) confidence -= 5;
  return Math.max(50, Math.min(99, confidence));
}

export function formatETA(eta) {
  if (!eta) return '';
  const mins = eta.estimatedMinutes;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function getETARange(eta) {
  if (!eta) return '';
  const min = Math.max(0, eta.estimatedMinutes - 5);
  const max = eta.estimatedMinutes + 10;
  return `${min}-${max} min`;
}