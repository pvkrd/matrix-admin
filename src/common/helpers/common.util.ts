export async function convertTimeToMinutes(time: string): Promise<number> {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
// Method to convert time to timestamp
export function timeToTimestamp(time: string, date: Date): number {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  date.setUTCHours(hours + 5, 0);
  return date.getTime();
}
export function timeToEndTimestamp(time: string, date: Date): number {
  if (!time) return null;
  let [hours, minutes] = time.split(':').map(Number);
  if (minutes > 0) {
    hours++;
    minutes = 0;
  }
  date.setUTCHours(hours + 5, 0);
  return date.getTime();
}

export async function getRandomTime(): Promise<string> {
  const hour = Math.floor(Math.random() * 24);
  return `${hour.toString().padStart(2, '0')}:00`;
}
