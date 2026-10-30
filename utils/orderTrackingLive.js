// Oh-Delivery Feature 22: Order Tracking Live utilities

export function getTrackingSteps() {
  return [
    { id: 'placed', label: 'Order Placed', icon: '📋' },
    { id: 'confirmed', label: 'Confirmed', icon: '✅' },
    { id: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { id: 'picked_up', label: 'Picked Up', icon: '🛵' },
    { id: 'on_way', label: 'On the Way', icon: '🗺️' },
    { id: 'delivered', label: 'Delivered', icon: '📦' },
  ];
}

export function getCurrentStepIndex(status) {
  const steps = getTrackingSteps();
  const idx = steps.findIndex(s => s.id === status);
  return idx >= 0 ? idx : 0;
}

export function getTrackingProgress(status) {
  const steps = getTrackingSteps();
  const idx = getCurrentStepIndex(status);
  return Math.round(((idx + 1) / steps.length) * 100);
}

export function getNextStep(status) {
  const steps = getTrackingSteps();
  const idx = getCurrentStepIndex(status);
  if (idx < steps.length - 1) return steps[idx + 1];
  return null;
}

export function isTrackingComplete(status) {
  return status === 'delivered';
}

export function getEstimatedArrival(order) {
  if (!order) return null;
  const baseTime = order.estimatedDeliveryTime || 30;
  const remaining = Math.max(0, baseTime - (order.elapsedMinutes || 0));
  return remaining;
}