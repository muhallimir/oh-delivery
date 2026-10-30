// Oh-Delivery Feature 23: Payment Methods utilities

export const PAYMENT_TYPES = ['card', 'cash', 'wallet', 'apple_pay', 'google_pay'];

export function validatePaymentMethod(method) {
  if (!method) return { valid: false, error: 'Payment method required' };
  if (!PAYMENT_TYPES.includes(method.type)) return { valid: false, error: 'Invalid payment type' };
  if (method.type === 'card' && !method.cardNumber) return { valid: false, error: 'Card number required' };
  return { valid: true };
}

export function maskCardNumber(cardNumber) {
  if (!cardNumber) return '';
  const last4 = cardNumber.slice(-4);
  return `**** **** **** ${last4}`;
}

export function getPaymentIcon(type) {
  const icons = { card: '💳', cash: '💵', wallet: '👛', apple_pay: '🍎', google_pay: 'G' };
  return icons[type] || '💳';
}

export function calculateProcessingFee(amount, type) {
  if (type === 'cash') return 0;
  return amount * 0.029 + 0.30; // 2.9% + $0.30
}

export function getDefaultPaymentMethod(methods) {
  if (!Array.isArray(methods) || methods.length === 0) return null;
  return methods.find(m => m.isDefault) || methods[0];
}