// Oh-Delivery Feature 12: Restaurant Operating Hours utilities

export function isOpenNow(hours, now = new Date()) {
  if (!hours) return false;
  const day = now.getDay();
  const dayHours = hours[day];
  if (!dayHours || dayHours.closed) return false;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTime(dayHours.open);
  const closeMinutes = parseTime(dayHours.close);
  if (closeMinutes < openMinutes) {
    // crosses midnight
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

export function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function getNextOpenTime(hours, now = new Date()) {
  if (!hours) return null;
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    const day = checkDate.getDay();
    const dayHours = hours[day];
    if (dayHours && !dayHours.closed) {
      return { day, open: dayHours.open, date: checkDate };
    }
  }
  return null;
}

export function formatOperatingHours(hours) {
  if (!hours) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map((day, i) => {
    const h = hours[i];
    if (!h || h.closed) return `${day}: Closed`;
    return `${day}: ${h.open} - ${h.close}`;
  }).join('\n');
}

export function getHoursUntilClose(hours, now = new Date()) {
  if (!hours || !isOpenNow(hours, now)) return 0;
  const day = now.getDay();
  const dayHours = hours[day];
  const closeMinutes = parseTime(dayHours.close);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return closeMinutes - currentMinutes;
}