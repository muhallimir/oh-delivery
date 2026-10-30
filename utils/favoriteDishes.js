// Oh-Delivery Feature 17: Favorite Dishes utilities

export function addFavoriteDish(favorites, dishId) {
  if (!dishId) return favorites;
  if (favorites.includes(dishId)) return favorites;
  return [...favorites, dishId];
}

export function removeFavoriteDish(favorites, dishId) {
  if (!dishId) return favorites;
  return favorites.filter(id => id !== dishId);
}

export function isFavoriteDish(favorites, dishId) {
  if (!Array.isArray(favorites)) return false;
  return favorites.includes(dishId);
}

export function getFavoriteDishes(dishes, favoriteIds) {
  if (!Array.isArray(dishes) || !Array.isArray(favoriteIds)) return [];
  return dishes.filter(d => favoriteIds.includes(d._id || d.id));
}

export function getFavoriteDishCount(favorites) {
  return Array.isArray(favorites) ? favorites.length : 0;
}

export function toggleFavoriteDish(favorites, dishId) {
  if (isFavoriteDish(favorites, dishId)) {
    return removeFavoriteDish(favorites, dishId);
  }
  return addFavoriteDish(favorites, dishId);
}