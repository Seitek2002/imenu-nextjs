export function isClosedNow(schedule: string): boolean {
  try {
    if (!schedule || !schedule.includes('-')) {
      // If schedule is unknown, do not block by default
      return false;
    }

    const [startTimeStr, endTimeStr] = schedule.split('-');
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number);

    const now = new Date();
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const nowTotalMinutes = nowHours * 60 + nowMinutes;

    // Equal start/end means 24/7 open
    if (startTotalMinutes === endTotalMinutes) {
      return false; // open
    }

    if (startTotalMinutes < endTotalMinutes) {
      // Same-day schedule, e.g. 09:00-18:00
      const isOpen =
        nowTotalMinutes >= startTotalMinutes && nowTotalMinutes < endTotalMinutes;
      return !isOpen;
    } else {
      // Overnight schedule, e.g. 22:00-06:00
      const isOpen =
        nowTotalMinutes >= startTotalMinutes || nowTotalMinutes < endTotalMinutes;
      return !isOpen;
    }
  } catch {
    // On parsing errors, do not block
    return false;
  }
}

/**
 * Formats schedule string to a human-friendly text in Russian.
 * - "09:00-18:00" -> "09:00–18:00"
 * - "00:00-00:00" -> "Круглосуточно"
 * - invalid/empty -> "не указан"
 */
export function formatSchedule(schedule: string): string {
  try {
    if (!schedule || !schedule.includes('-')) return 'не указан';
    const [startTimeStrRaw, endTimeStrRaw] = schedule.split('-');
    const startTimeStr = (startTimeStrRaw || '').trim();
    const endTimeStr = (endTimeStrRaw || '').trim();

    const [sh, sm] = startTimeStr.split(':').map(Number);
    const [eh, em] = endTimeStr.split(':').map(Number);
    if (
      Number.isNaN(sh) ||
      Number.isNaN(sm) ||
      Number.isNaN(eh) ||
      Number.isNaN(em)
    ) {
      return 'не указан';
    }

    if (sh * 60 + sm === eh * 60 + em) {
      return 'Круглосуточно';
    }

    return `${startTimeStr}–${endTimeStr}`;
  } catch {
    return 'не указан';
  }
}
