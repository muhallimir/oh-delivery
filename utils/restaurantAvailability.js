// Oh-Delivery Feature 29: Restaurant Availability utilities

export function isRestaurantAvailable(restaurant, now = new Date()) {
  if (!restaurant) return false;
  if (restaurant.closed) return false;
  if (restaurant.temporarilyClosed) return false;
  return true;
}

export function getAvailabilityStatus(restaurant) {
  if (!restaurant) return 'unknown';
  if (restaurant.closed) return 'closed';
  if (restaurant.temporarilyClosed) return 'temporarily_closed';
  if (restaurant.busy) return 'busy';
  return 'open';
}

export function getAvailabilityColor(status) {
  const colors = {
    open: '#16a34a',
    busy: '#f59e0b',
    closed: '#dc2626',
    temporarily_closed: '#6b7280',
    unknown: '#6b7280',
  };
  return colors[status] || '#6b7280';
}

export function getAvailabilityText(status) {
  const texts = {
    open: 'Open',
    busy: 'Busy',
    closed: 'Closed',
    temporarily_closed: 'Temporarily Closed',
    unknown: 'Unknown',
  };
  return texts[status] || 'Unknown';
}

export function filterAvailableRestaurants(restaurants) {
  if (!Array.isArray(restaurants)) return [];
  return restaurants.filter(r => isRestaurantAvailable(r));
}