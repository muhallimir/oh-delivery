// Oh-Delivery Feature 14: Order Splitting utilities

export function splitOrder(items, splitCount) {
  if (!Array.isArray(items) || splitCount <= 0) return [];
  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const perPerson = total / splitCount;
  return Array.from({ length: splitCount }, (_, i) => ({
    person: i + 1,
    amount: perPerson,
    items: items,
  }));
}

export function splitByItems(items, assignments) {
  if (!Array.isArray(items) || !Array.isArray(assignments)) return [];
  return assignments.map((assignment, i) => ({
    person: i + 1,
    itemIndices: assignment,
    amount: assignment.reduce((sum, idx) => sum + (items[idx]?.price || 0) * (items[idx]?.quantity || 1), 0),
  }));
}

export function calculateSplitTotal(splits) {
  if (!Array.isArray(splits)) return 0;
  return splits.reduce((sum, s) => sum + (s.amount || 0), 0);
}

export function formatSplitSummary(splits) {
  if (!Array.isArray(splits) || splits.length === 0) return '';
  return splits.map(s => `Person ${s.person}: $${s.amount.toFixed(2)}`).join('\n');
}