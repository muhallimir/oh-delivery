import { createGroupOrder, addMemberToGroup, addItemToGroup, getGroupTotal, getMemberItems, closeGroupOrder, isGroupOrderExpired, getGroupSummary } from '../utils/groupOrdering';

describe('Group Ordering - Oh-Delivery Feature 3', () => {
  test('createGroupOrder creates group', () => {
    const group = createGroupOrder('host1', 'rest1');
    expect(group).not.toBeNull();
    expect(group.hostId).toBe('host1');
    expect(group.members).toContain('host1');
    expect(group.status).toBe('open');
  });

  test('createGroupOrder rejects invalid', () => {
    expect(createGroupOrder(null, 'rest1')).toBeNull();
    expect(createGroupOrder('host1', null)).toBeNull();
  });

  test('addMemberToGroup adds member', () => {
    const group = createGroupOrder('host1', 'rest1');
    const updated = addMemberToGroup(group, 'member2');
    expect(updated.members).toContain('member2');
  });

  test('addMemberToGroup does not duplicate', () => {
    const group = createGroupOrder('host1', 'rest1');
    const updated = addMemberToGroup(group, 'host1');
    expect(updated.members).toHaveLength(1);
  });

  test('addItemToGroup adds item', () => {
    const group = createGroupOrder('host1', 'rest1');
    const updated = addItemToGroup(group, 'host1', { name: 'Pizza', price: 15, quantity: 1 });
    expect(updated.items).toHaveLength(1);
  });

  test('getGroupTotal calculates total', () => {
    const group = createGroupOrder('host1', 'rest1');
    const updated = addItemToGroup(group, 'host1', { name: 'Pizza', price: 15, quantity: 2 });
    expect(getGroupTotal(updated)).toBe(30);
  });

  test('getMemberItems filters by member', () => {
    const group = createGroupOrder('host1', 'rest1');
    const updated = addItemToGroup(group, 'host1', { name: 'Pizza', price: 15, quantity: 1 });
    expect(getMemberItems(updated, 'host1')).toHaveLength(1);
    expect(getMemberItems(updated, 'member2')).toHaveLength(0);
  });

  test('closeGroupOrder closes', () => {
    const group = createGroupOrder('host1', 'rest1');
    const closed = closeGroupOrder(group);
    expect(closed.status).toBe('closed');
  });

  test('getGroupSummary formats correctly', () => {
    const group = createGroupOrder('host1', 'rest1');
    const summary = getGroupSummary(group);
    expect(summary).toContain('1 members');
  });
});