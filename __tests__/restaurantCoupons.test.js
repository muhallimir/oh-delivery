import { validateRestaurantCoupon, applyRestaurantCoupon, getRestaurantCoupons, RESTAURANT_COUPONS } from '../utils/restaurantCoupons';

describe('Restaurant Coupons - Oh-Delivery Feature 15', () => {
  test('validateRestaurantCoupon validates valid', () => {
    const result = validateRestaurantCoupon('PIZZA20', 'rest1');
    expect(result.valid).toBe(true);
  });

  test('validateRestaurantCoupon rejects invalid restaurant', () => {
    const result = validateRestaurantCoupon('PIZZA20', 'rest2');
    expect(result.valid).toBe(false);
  });

  test('validateRestaurantCoupon rejects invalid code', () => {
    const result = validateRestaurantCoupon('INVALID', 'rest1');
    expect(result.valid).toBe(false);
  });

  test('validateRestaurantCoupon rejects empty', () => {
    const result = validateRestaurantCoupon('', 'rest1');
    expect(result.valid).toBe(false);
  });

  test('applyRestaurantCoupon applies percent', () => {
    const coupon = RESTAURANT_COUPONS.PIZZA20;
    const result = applyRestaurantCoupon(100, 5, coupon);
    expect(result.subtotal).toBe(80);
    expect(result.discount).toBe(20);
  });

  test('applyRestaurantCoupon applies fixed', () => {
    const coupon = RESTAURANT_COUPONS.BURGER10;
    const result = applyRestaurantCoupon(100, 5, coupon);
    expect(result.subtotal).toBe(95);
  });

  test('applyRestaurantCoupon applies shipping', () => {
    const coupon = RESTAURANT_COUPONS.FREESHIP;
    const result = applyRestaurantCoupon(100, 5, coupon);
    expect(result.deliveryFee).toBe(0);
  });

  test('getRestaurantCoupons filters', () => {
    const coupons = getRestaurantCoupons('rest1');
    expect(coupons.length).toBeGreaterThan(0);
  });
});