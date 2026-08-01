const utcDateKey = (value) => value.toISOString().slice(0, 10);

export const buildFleetSnapshotQuery = (dateValue, hourValue, now = new Date()) => {
  const normalizedHour = hourValue ?? '';
  if (!dateValue && !normalizedHour) return null;

  const date = dateValue || utcDateKey(now);
  if (normalizedHour !== '') {
    const hour = String(normalizedHour).padStart(2, '0');
    return {
      fromDate: `${date}T${hour}:00:00.000Z`,
      toDate: `${date}T${hour}:59:59.999Z`,
      interval: 'hour',
      desc: false,
      take: 1
    };
  }

  const isToday = date === utcDateKey(now);
  return {
    fromDate: `${date}T00:00:00.000Z`,
    toDate: isToday ? now.toISOString() : `${date}T23:59:59.999Z`,
    interval: 'hour',
    desc: isToday,
    take: 1
  };
};
