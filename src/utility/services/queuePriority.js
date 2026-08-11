export function interleavePriorityQueue(tickets = []) {
  if (!Array.isArray(tickets)) return [];

  const bookings = tickets.filter(t => t.isBooking || t.sdmsBookingId || t.queueNumber?.startsWith('B-'));
  const walkIns = tickets.filter(t => !t.isBooking && !t.sdmsBookingId && !t.queueNumber?.startsWith('B-'));

  const result = [];
  let bIdx = 0;
  let wIdx = 0;

  while (bIdx < bookings.length || wIdx < walkIns.length) {
    if (bIdx < bookings.length) result.push(bookings[bIdx++]);
    if (bIdx < bookings.length) result.push(bookings[bIdx++]);
    if (wIdx < walkIns.length) result.push(walkIns[wIdx++]);
  }

  return result;
}
