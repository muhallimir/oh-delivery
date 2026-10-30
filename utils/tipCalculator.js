// Oh-Delivery Feature 13: Tip Calculator utilities

export function calculateTip(subtotal, tipPercent) {
  if (!subtotal || subtotal <= 0) return 0;
  return subtotal * (tipPercent / 100);
}

export function getTipOptions() {
  return [10, 15, 18, 20, 25];
}

export function calculateCustomTip(subtotal, amount) {
  if (!subtotal || subtotal <= 0 || !amount || amount < 0) return 0;
  return amount;
}

export function calculateTotalWithTip(subtotal, deliveryFee, tipAmount) {
  return subtotal + deliveryFee + (tipAmount || 0);
}

export function getTipPercentage(subtotal, tipAmount) {
  if (!subtotal || subtotal <= 0) return 0;
  return (tipAmount / subtotal) * 100;
}

export function formatTip(amount) {
  return `$${(amount || 0).toFixed(2)}`;
}