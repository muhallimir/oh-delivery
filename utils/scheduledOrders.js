// Oh-Delivery: Scheduled Orders utilities - pure functions for TDD

export function createScheduledOrder(order, scheduledTime) {
  if (!order || !scheduledTime) return null;
  const scheduled = new Date(scheduledTime);
  if (isNaN(scheduled.getTime())) return null;
  if (scheduled.getTime() < Date.now()) return null;
  return {
    ...order,
    scheduledFor: scheduled.getTime(),
    isScheduled: true,
    status: 'scheduled',
  };
}

export function isScheduledOrder(order) {
  return !!(order && order.isScheduled && order.scheduledFor);
}

export function getTimeUntilDelivery(order) {
  if (!isScheduledOrder(order)) return 0;
  return Math.max(0, order.scheduledFor - Date.now());
}

export function formatScheduledTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function canModifyScheduledOrder(order) {
  if (!isScheduledOrder(order)) return false;
  const timeUntil = getTimeUntilDelivery(order);
  return timeUntil > 30 * 60 * 1000; // 30 minutes before
}

export function getAvailableTimeSlots(startHour = 8, endHour = 22, intervalMinutes = 30) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      slots.push({ hour: h, minute: m, label: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` });
    }
  }
  return slots;
}