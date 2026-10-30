// Oh-Delivery Feature 28: Delivery Promotions utilities

export function getActivePromotions(promotions) {
  if (!Array.isArray(promotions)) return [];
  const now = Date.now();
  return promotions.filter(p => {
    if (!p.active) return false;
    if (p.startDate && now < new Date(p.startDate).getTime()) return false;
    if (p.endDate && now > new Date(p.endDate).getTime()) return false;
    return true;
  });
}

export function calculatePromoDiscount(orderTotal, promo) {
  if (!promo) return 0;
  if (promo.type === 'percent') return orderTotal * (promo.value / 100);
  if (promo.type === 'fixed') return Math.min(orderTotal, promo.value);
  if (promo.type === 'free_delivery') return 0;
  return 0;
}

export function isPromoApplicable(promo, orderTotal, restaurantId) {
  if (!promo) return false;
  if (promo.minOrder && orderTotal < promo.minOrder) return false;
  if (promo.restaurantId && promo.restaurantId !== restaurantId) return false;
  return true;
}

export function getPromoBadge(promo) {
  if (!promo) return null;
  if (promo.type === 'percent') return { text: `${promo.value}% OFF`, color: '#dc2626' };
  if (promo.type === 'fixed') return { text: `$${promo.value} OFF`, color: '#dc2626' };
  if (promo.type === 'free_delivery') return { text: 'Free Delivery', color: '#16a34a' };
  return null;
}

export function sortPromotionsByValue(promotions) {
  if (!Array.isArray(promotions)) return [];
  return [...promotions].sort((a, b) => {
    const valA = a.type === 'percent' ? a.value : a.type === 'fixed' ? a.value : 0;
    const valB = b.type === 'percent' ? b.value : b.type === 'fixed' ? b.value : 0;
    return valB - valA;
  });
}