import { createScheduledOrder, isScheduledOrder, getTimeUntilDelivery, formatScheduledTime, canModifyScheduledOrder, getAvailableTimeSlots } from '../utils/scheduledOrders';

describe('Scheduled Orders - Oh-Delivery Feature 2', () => {
  test('createScheduledOrder creates order', () => {
    const future = Date.now() + 3600000;
    const order = createScheduledOrder({ id: '1' }, future);
    expect(order).not.toBeNull();
    expect(order.isScheduled).toBe(true);
    expect(order.status).toBe('scheduled');
  });

  test('createScheduledOrder rejects past time', () => {
    expect(createScheduledOrder({ id: '1' }, Date.now() - 1000)).toBeNull();
  });

  test('createScheduledOrder rejects invalid time', () => {
    expect(createScheduledOrder({ id: '1' }, 'invalid')).toBeNull();
  });

  test('createScheduledOrder rejects null', () => {
    expect(createScheduledOrder(null, Date.now() + 1000)).toBeNull();
  });

  test('isScheduledOrder checks flag', () => {
    expect(isScheduledOrder({ isScheduled: true, scheduledFor: 123 })).toBe(true);
    expect(isScheduledOrder({})).toBe(false);
  });

  test('getTimeUntilDelivery returns time', () => {
    const future = Date.now() + 3600000;
    const order = { isScheduled: true, scheduledFor: future };
    expect(getTimeUntilDelivery(order)).toBeGreaterThan(0);
  });

  test('formatScheduledTime formats', () => {
    expect(formatScheduledTime(Date.now())).toBeTruthy();
    expect(formatScheduledTime(null)).toBe('');
  });

  test('canModifyScheduledOrder checks time', () => {
    const future = Date.now() + 3600000;
    const order = { isScheduled: true, scheduledFor: future };
    expect(canModifyScheduledOrder(order)).toBe(true);
  });

  test('getAvailableTimeSlots returns slots', () => {
    const slots = getAvailableTimeSlots(8, 10, 30);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].label).toBe('08:00');
  });
});