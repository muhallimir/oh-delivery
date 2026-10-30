// Oh-Delivery: Group Ordering utilities - pure functions for TDD

export function createGroupOrder(hostId, restaurantId) {
  if (!hostId || !restaurantId) return null;
  return {
    id: `group-${Date.now()}`,
    hostId,
    restaurantId,
    members: [hostId],
    items: [],
    status: 'open',
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 min
  };
}

export function addMemberToGroup(group, memberId) {
  if (!group || !memberId) return group;
  if (group.members.includes(memberId)) return group;
  if (group.status !== 'open') return group;
  return { ...group, members: [...group.members, memberId] };
}

export function addItemToGroup(group, memberId, item) {
  if (!group || !memberId || !item) return group;
  if (!group.members.includes(memberId)) return group;
  if (group.status !== 'open') return group;
  return { ...group, items: [...group.items, { ...item, addedBy: memberId }] };
}

export function getGroupTotal(group) {
  if (!group || !Array.isArray(group.items)) return 0;
  return group.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
}

export function getMemberItems(group, memberId) {
  if (!group || !Array.isArray(group.items)) return [];
  return group.items.filter(item => item.addedBy === memberId);
}

export function closeGroupOrder(group) {
  if (!group) return null;
  return { ...group, status: 'closed', closedAt: Date.now() };
}

export function isGroupOrderExpired(group) {
  if (!group) return true;
  return Date.now() > group.expiresAt;
}

export function getGroupSummary(group) {
  if (!group) return '';
  return `${group.members.length} members, ${group.items.length} items, total: $${getGroupTotal(group).toFixed(2)}`;
}