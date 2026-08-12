export const RatiosEnum = {
  BookingSro: 'bookingSro',
  UnitIntake: 'unitIntake',
  BookingShowUp: 'bookingShowUp'
};

export const MonthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function createEmptyRkaTarget(dealerCode, year, month) {
  return {
    dealerCode,
    year: Number(year),
    month: Number(month),
    bookingSroTarget: 0,
    unitIntakeTarget: 0,
    bookingShowUpTarget: 0
  };
}

export function calculateAchievementRatio(actual, target) {
  const numericActual = Number(actual) || 0;
  const numericTarget = Number(target) || 0;

  if (numericTarget <= 0) {
    return 0;
  }

  return Math.round((numericActual / numericTarget) * 100);
}
