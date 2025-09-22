import { IWorkSchedule } from 'types/venues.types';

export type DayWindow = { start: string; end: string };
export type TodayWindowResult = {
  window: DayWindow | null;
  isClosed: boolean; // true when explicitly a day off
};

/**
 * Parse schedule like "HH:MM-HH:MM" into day window.
 * If both equal => 24/7.
 */
export function parseSchedule(schedule?: string): { window: DayWindow | null; is247: boolean } {
  if (!schedule || !schedule.includes('-')) return { window: null, is247: false };
  const [startRaw, endRaw] = schedule.split('-');
  const start = (startRaw || '').trim();
  const end = (endRaw || '').trim();
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
    return { window: null, is247: false };
  }
  const is247 = start === end;
  return { window: { start, end }, is247 };
}

/**
 * Convert JS Date.getDay (0=Sun..6=Sat) to OpenAPI dayOfWeek (1=Mon..7=Sun)
 */
function getOpenApiDow(d: Date = new Date()): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  const js = d.getDay(); // 0..6
  // map: Sun(0)->7, Mon(1)->1, ..., Sat(6)->6
  return ((js + 6) % 7) + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

/**
 * Build today's window from weekly schedules (OpenAPI) with a legacy fallback string.
 * - If is24h: 00:00-00:00 and isClosed=false
 * - If isDayOff: window=null and isClosed=true
 * - Else use workStart/workEnd if present
 * - Else fallback to legacy string (if provided)
 * - If nothing available -> {window:null, isClosed:false} (do not block)
 */
export function getTodayScheduleWindow(
  schedules?: IWorkSchedule[] | null,
  fallbackSchedule?: string
): TodayWindowResult {
  try {
    const dow = getOpenApiDow();
    if (Array.isArray(schedules) && schedules.length > 0) {
      const today = schedules.find((s) => s?.dayOfWeek === dow);
      if (today) {
        if (today.is24h) {
          return { window: { start: '00:00', end: '00:00' }, isClosed: false };
        }
        if (today.isDayOff) {
          return { window: null, isClosed: true };
        }
        if (today.workStart && today.workEnd) {
          const start = today.workStart.trim();
          const end = today.workEnd.trim();
          if (/^\d{2}:\d{2}$/.test(start) && /^\d{2}:\d{2}$/.test(end)) {
            return { window: { start, end }, isClosed: false };
          }
        }
        // fallthrough to fallback if today's item incomplete
      }
    }
    // fallback legacy schedule string
    const { window, is247 } = parseSchedule(fallbackSchedule);
    if (is247) return { window: { start: '00:00', end: '00:00' }, isClosed: false };
    if (!window) return { window: null, isClosed: false }; // unknown -> do not block
    return { window, isClosed: false };
  } catch {
    return { window: null, isClosed: false };
  }
}

/**
 * Build a "HH:MM-HH:MM" string for today's schedule when possible,
 * supporting 24/7 and day-off cases. Used for display formatting.
 */
export function getTodayScheduleRangeString(
  schedules?: IWorkSchedule[] | null,
  fallbackSchedule?: string
): string {
  const res = getTodayScheduleWindow(schedules, fallbackSchedule);
  if (!res.window) {
    // day off or unknown. For unknown return empty, for day off also empty (formatter can show "не указан" or UI can show "—")
    return '';
  }
  return `${res.window.start}-${res.window.end}`;
}

/**
 * Check if current time is outside given window. Supports overnight windows (e.g. 22:00-06:00).
 * If window is null -> treat as open (do not block).
 */
export function isOutsideWorkTime(win: DayWindow | null): boolean {
  if (!win) return false;

  const [sh, sm] = win.start.split(':').map(Number);
  const [eh, em] = win.end.split(':').map(Number);

  const startTotal = sh * 60 + sm;
  const endTotal = eh * 60 + em;

  const now = new Date();
  const nowTotal = now.getHours() * 60 + now.getMinutes();

  // 24/7 guard
  if (startTotal === endTotal) return false;

  if (startTotal < endTotal) {
    // same-day window
    const open = nowTotal >= startTotal && nowTotal < endTotal;
    return !open;
  } else {
    // overnight window
    const open = nowTotal >= startTotal || nowTotal < endTotal;
    return !open;
  }
}
