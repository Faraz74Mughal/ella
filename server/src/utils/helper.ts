// Add in date
export const addTimeFromString=(timeString: string): Date | null=> {
  if (!timeString || timeString === null) return null;

  let numExp = timeString.match(/\d+/);
  if (!numExp) return null;

  let unitExp = timeString.match(/[a-zA-Z]+/);
  if (!unitExp) return null;

  const now = new Date(); 

  const num = parseInt(numExp[0]);
  const unit = unitExp[0].toLowerCase();

  let futureDate = new Date(now);

  switch (unit) {
    case 'd':
      futureDate.setDate(now.getDate() + num);
      break;
    case 'h':
      futureDate.setHours(now.getHours() + num);
      break;
    case 'm':
      futureDate.setMinutes(now.getMinutes() + num);
      break;
    case 's':
      futureDate.setSeconds(now.getSeconds() + num);
      break;
    default:
      throw new Error('Invalid time unit. Use d (days), h (hours), m (minutes), or s (seconds).');
  }

  return futureDate;
}
