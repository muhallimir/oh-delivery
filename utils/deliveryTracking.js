// Oh-Delivery: Live Delivery Tracking utilities - pure functions for TDD

export function getDeliveryStatus(status) {
  const statuses = {
    preparing: { text: 'Preparing your order', color: '#f59e0b', progress: 20 },
    picked_up: { text: 'Driver picked up', color: '#3b82f6', progress: 40 },
    on_the_way: { text: 'On the way', color: '#8b5cf6', progress: 60 },
    arriving: { text: 'Arriving soon', color: '#10b981', progress: 80 },
    delivered: { text: 'Delivered', color: '#16a34a', progress: 100 },
  };
  return statuses[status] || { text: 'Unknown', color: '#6b7280', progress: 0 };
}

export function calculateETA(distanceKm, speedKmh = 30) {
  if (!distanceKm || distanceKm <= 0) return 0;
  return Math.ceil((distanceKm / speedKmh) * 60);
}

export function formatETA(minutes) {
  if (minutes <= 0) return 'Arriving now';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function getDeliveryProgress(status) {
  return getDeliveryStatus(status).progress;
}

export function isDeliveryActive(status) {
  return ['preparing', 'picked_up', 'on_the_way', 'arriving'].includes(status);
}

export function getDriverInfo(order) {
  if (!order || !order.driver) return null;
  return {
    name: order.driver.name || 'Driver',
    phone: order.driver.phone || '',
    rating: order.driver.rating || 5.0,
    vehicle: order.driver.vehicle || 'Bike',
    photo: order.driver.photo || '',
  };
}