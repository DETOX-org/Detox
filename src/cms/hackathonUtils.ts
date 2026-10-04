import type { HackathonItem } from './types';

/**
 * Classifies a hackathon as UPCOMING, ONGOING, or PREVIOUS.
 * Follows automatic date logic with admin explicit override capability.
 */
export function classifyHackathon(h: HackathonItem): 'UPCOMING' | 'ONGOING' | 'PREVIOUS' {
  if (h.status === 'PREVIOUS' || h.status === 'ARCHIVED') {
    return 'PREVIOUS';
  }

  const now = new Date();
  const start = new Date(h.startDate);
  const end = new Date(h.endDate);

  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
    if (now < start) {
      return h.status === 'ONGOING' ? 'ONGOING' : 'UPCOMING';
    }
    if (now >= start && now <= end) {
      return 'ONGOING';
    }
    if (now > end) {
      return 'PREVIOUS';
    }
  }

  if (h.status === 'ONGOING') return 'ONGOING';
  if (h.status === 'UPCOMING') return 'UPCOMING';
  return 'PREVIOUS';
}

export function formatDateRange(startDateStr: string, endDateStr: string): string {
  try {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return `${startDateStr} — ${endDateStr}`;
    }
    const sDay = s.getDate().toString().padStart(2, '0');
    const sMonth = s.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const eDay = e.getDate().toString().padStart(2, '0');
    const eMonth = e.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = e.getFullYear();

    if (sMonth === eMonth) {
      return `${sDay} ${sMonth} — ${eDay} ${eMonth} ${year}`;
    }
    return `${sDay} ${sMonth} — ${eDay} ${eMonth} ${year}`;
  } catch {
    return `${startDateStr} — ${endDateStr}`;
  }
}

export function formatSimpleDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  } catch {
    return dateStr;
  }
}
