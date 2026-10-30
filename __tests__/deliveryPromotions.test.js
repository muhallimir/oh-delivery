import { getActivePromotions, calculatePromoDiscount, isPromoApplicable, getPromoBadge, sortPromotionsByValue } from '../utils/deliveryPromotions';

describe('Delivery Promotions - Oh-Delivery Feature 28', () => {
  const promotions = [
    { id: '1', active: true, type: 'percent', value: 20, startDate: new Date(Date.now() - 1000) },
    { id: '2', active: true, type: 'fixed', value: 5, endDate: new Date(Date.now() - 1000) },
  ];

  test('getActivePromotions filters active', () => {
    const active = getActivePromotions(promotions);
    expect(active).toHaveLength(1);
  });

  test('calculatePromoDiscount calculates percent', () => {
    const promo = { type: 'percent', value: 20 };
    expect(calculatePromoDiscount(100, promo)).toBe(20);
  });

  test('calculatePromoDiscount calculates fixed', () => {
    const promo = { type: 'fixed', value: 5 };
    expect(calculatePromoDiscount(100, promo)).toBe(5);
  });

  test('isPromoApplicable checks min order', () => {
    const promo = { minOrder: 50 };
    expect(isPromoApplicable(promo, 60)).toBe(true);
    expect(isPromoApplicable(promo, 30)).toBe(false);
  });

  test('getPromoBadge returns badge', () => {
    const badge = getPromoBadge({ type: 'percent', value: 20 });
    expect(badge.text).toBe('20% OFF');
  });

  test('sortPromotionsByValue sorts', () => {
    const promos = [{ type: 'percent', value: 10 }, { type: 'percent', value: 20 }];
    const sorted = sortPromotionsByValue(promos);
    expect(sorted[0].value).toBe(20);
  });
});