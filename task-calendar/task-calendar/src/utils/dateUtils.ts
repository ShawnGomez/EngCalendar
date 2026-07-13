export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getTimeLeft(dateStr: string, timeStr?: string): string {
  const now = new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  const due = timeStr
    ? new Date(y, m - 1, d, ...timeStr.split(':').map(Number) as [number, number])
    : new Date(y, m - 1, d, 23, 59, 59);

  const diff = due.getTime() - now.getTime();

  if (diff < 0) return 'Overdue';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 1) return `${days} days left`;
  if (days === 1) return '1 day left';
  if (hours > 1) return `${hours} hours left`;
  if (hours === 1) return '1 hour left';
  if (minutes > 1) return `${minutes} minutes left`;
  return 'Due very soon';
}

export function isOverdue(dateStr: string): boolean {
  const [y, m, d] = dateStr.split('-').map(Number);
  const due = new Date(y, m - 1, d, 23, 59, 59);
  return due.getTime() < Date.now();
}

export function todayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function buildCalendarWeeks(year: number, month: number): (string | null)[][] {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
