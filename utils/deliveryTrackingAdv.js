// Oh-Delivery Feature 30: Delivery Tracking Advanced utilities

export function getLiveTrackingData(order) {
  if (!order) return null;
  return {
    orderId: order._id || order.id,
    status: order.status || 'pending',
    driverLocation: order.driverLocation || null,
    estimatedArrival: order.estimatedArrival || null,
    distance: order.distance || 0,
    progress: getTrackingProgress(order.status),
  };
}

export function getTrackingProgress(status) {
  const progress = {
    placed: 10,
    confirmed: 20,
    preparing: 40,
    picked_up: 60,
    on_the_way: 80,
    arriving: 90,
    delivered: 100,
  };
  return progress[status] || 0;
}

export function formatDriverLocation(location) {
  if (!location) return 'Unknown';
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
}

export function getTrackingUpdateMessage(status) {
  const messages = {
    placed: 'Order placed successfully',
    confirmed: 'Restaurant confirmed your order',
    preparing: 'Your food is being prepared',
    picked_up: 'Driver picked up your order',
    on_the_way: 'Driver is on the way',
    arriving: 'Driver is arriving',
    delivered: 'Order delivered! Enjoy your meal',
  };
  return messages[status] || 'Order updated';
}

export function shouldShowMap(status) {
  return ['picked_up', 'on_the_way', 'arriving'].includes(status);
}