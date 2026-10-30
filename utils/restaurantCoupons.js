// Oh-Delivery Feature 15: Restaurant Coupons utilities

export const RESTAURANT_COUPONS = {
  PIZZA20: { code: 'PIZZA20', type: 'percent', value: 20, restaurantId: 'rest1', description: '20% off pizza' },
  BURGER10: { code: 'BURGER10', type: 'fixed', value: 5, restaurantId: 'rest2', description: '$5 off burgers' },
  FREESHIP: { code: 'FREESHIP', type: 'shipping', value: 0, restaurantId: null, description: 'Free delivery' },
};

export function validateRestaurantCoupon(code, restaurantId) {
  if (!code) return { valid: false, error: 'Enter a code' };
  const coupon = RESTAURANT_COUPONS[code.toUpperCase()];
  if (!coupon) return { valid: false, error: 'Invalid coupon' };
  if (coupon.restaurantId && coupon.restaurantId !== restaurantId) {
    return { valid: false, error: 'Coupon not valid for this restaurant' };
  }
  return { valid: true, coupon };
}

export function applyRestaurantCoupon(subtotal, deliveryFee, coupon) {
  if (!coupon) return { subtotal, deliveryFee, discount: 0 };
  if (coupon.type === 'percent') {
    const discount = subtotal * (coupon.value / 100);
    return { subtotal: subtotal - discount, deliveryFee, discount };
  }
  if (coupon.type === 'fixed') {
    return { subtotal: Math.max(0, subtotal - coupon.value), deliveryFee, discount: coupon.value };
  }
  if (coupon.type === 'shipping') {
    return { subtotal, deliveryFee: 0, discount: deliveryFee };
  }
  return { subtotal, deliveryFee, discount: 0 };
}

export function getRestaurantCoupons(restaurantId) {
  return Object.values(RESTAURANT_COUPONS).filter(c => !c.restaurantId || c.restaurantId === restaurantId);
}