import { validatePaymentMethod, maskCardNumber, getPaymentIcon, calculateProcessingFee, getDefaultPaymentMethod, PAYMENT_TYPES } from '../utils/paymentMethods';

describe('Payment Methods - Oh-Delivery Feature 23', () => {
  test('PAYMENT_TYPES includes types', () => {
    expect(PAYMENT_TYPES).toContain('card');
    expect(PAYMENT_TYPES).toContain('apple_pay');
  });

  test('validatePaymentMethod validates card', () => {
    const result = validatePaymentMethod({ type: 'card', cardNumber: '1234' });
    expect(result.valid).toBe(true);
  });

  test('validatePaymentMethod rejects missing card number', () => {
    const result = validatePaymentMethod({ type: 'card' });
    expect(result.valid).toBe(false);
  });

  test('maskCardNumber masks', () => {
    expect(maskCardNumber('1234567890123456')).toBe('**** **** **** 3456');
  });

  test('getPaymentIcon returns icon', () => {
    expect(getPaymentIcon('card')).toBe('💳');
  });

  test('calculateProcessingFee calculates', () => {
    expect(calculateProcessingFee(100, 'card')).toBeCloseTo(3.2);
    expect(calculateProcessingFee(100, 'cash')).toBe(0);
  });

  test('getDefaultPaymentMethod returns default', () => {
    const methods = [{ isDefault: false }, { isDefault: true }];
    expect(getDefaultPaymentMethod(methods).isDefault).toBe(true);
  });
});