// Oh-Delivery: Favorite Restaurants utilities - pure functions for TDD

export function addFavorite(favorites, restaurantId) {
  if (!restaurantId) return favorites;
  if (favorites.includes(restaurantId)) return favorites;
  return [...favorites, restaurantId];
}

export function removeFavorite(favorites, restaurantId) {
  if (!restaurantId) return favorites;
  return favorites.filter(id => id !== restaurantId);
}

export function isFavorite(favorites, restaurantId) {
  if (!Array.isArray(favorites)) return false;
  return favorites.includes(restaurantId);
}

export function getFavoriteRestaurants(restaurants, favoriteIds) {
  if (!Array.isArray(restaurants) || !Array.isArray(favoriteIds)) return [];
  return restaurants.filter(r => favoriteIds.includes(r._id || r.id));
}

export function getFavoriteCount(favorites) {
  if (!Array.isArray(favorites)) return 0;
  return favorites.length;
}

export function toggleFavorite(favorites, restaurantId) {
  if (isFavorite(favorites, restaurantId)) {
    return removeFavorite(favorites, restaurantId);
  }
  return addFavorite(favorites, restaurantId);
}