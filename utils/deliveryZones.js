// Oh-Delivery Feature 11: Delivery Zones utilities

export function isWithinDeliveryZone(location, zones) {
  if (!location || !Array.isArray(zones)) return false;
  return zones.some(zone => {
    const distance = calculateDistance(location, zone.center);
    return distance <= zone.radius;
  });
}

export function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2) return Infinity;
  const R = 6371; // km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDeliveryZone(location, zones) {
  if (!location || !Array.isArray(zones)) return null;
  return zones.find(zone => {
    const distance = calculateDistance(location, zone.center);
    return distance <= zone.radius;
  }) || null;
}

export function getZoneDeliveryFee(zone) {
  if (!zone) return 0;
  return zone.deliveryFee || 0;
}

export function getAvailableZones(zones) {
  if (!Array.isArray(zones)) return [];
  return zones.filter(z => z.active !== false);
}