import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IWorkSchedule } from 'types/venues.types';
import { useAppSelector } from 'hooks/useAppSelector';

import './index.scss';

import { formatSchedule } from 'src/utlis/workTime';

type Props = {
  isShow: boolean;
  onClose: () => void;
  // OpenAPI: array of weekly schedules; still optional to remain backward-compatible
  schedules?: IWorkSchedule[] | null;
  // Fallback legacy daily schedule string, e.g. "09:00-18:00"
  fallbackSchedule?: string;
};

const DAY_ORDER: { dow: 1 | 2 | 3 | 4 | 5 | 6 | 7; label: string }[] = [
  { dow: 1, label: 'Пн' },
  { dow: 2, label: 'Вт' },
  { dow: 3, label: 'Ср' },
  { dow: 4, label: 'Чт' },
  { dow: 5, label: 'Пт' },
  { dow: 6, label: 'Сб' },
  { dow: 7, label: 'Вс' },
];

function scheduleItemToText(s: IWorkSchedule | undefined, fallback?: string): string {
  if (!s) {
    // No weekly item -> fallback to legacy daily string if provided
    if (fallback) return formatSchedule(fallback);
    return 'не указан';
  }
  if (s.is24h) {
    // match existing formatting helper: 00:00-00:00 -> "Круглосуточно"
    return formatSchedule('00:00-00:00');
  }
  if (s.isDayOff) {
    // keep neutral symbol to avoid hardcoding a localized string here
    return '—';
  }
  if (s.workStart && s.workEnd) {
    return formatSchedule(`${s.workStart}-${s.workEnd}`);
  }
  // last resort
  return 'не указан';
}

const WeeklyScheduleModal: FC<Props> = ({ isShow, onClose, schedules, fallbackSchedule }) => {
  const colorTheme =
    useAppSelector((state) => state.yourFeature.venue?.colorTheme) || '#875AFF';
  const { t } = useTranslation();
  const todayDow = ((new Date().getDay() || 7) as 1 | 2 | 3 | 4 | 5 | 6 | 7);

  const weekly = useMemo(() => {
    const arr: { dow: number; label: string; time: string }[] = [];
    const mapByDow: Record<number, IWorkSchedule> = {};
    if (Array.isArray(schedules)) {
      for (const it of schedules) {
        if (it && typeof it.dayOfWeek === 'number') {
          mapByDow[it.dayOfWeek] = it;
        }
      }
    }
    for (const d of DAY_ORDER) {
      arr.push({
        dow: d.dow,
        label: d.label,
        time: scheduleItemToText(mapByDow[d.dow], fallbackSchedule),
      });
    }
    return arr;
  }, [schedules, fallbackSchedule]);

  return (
    <>
      <div className={isShow ? 'overlay active' : 'overlay'} onClick={onClose} />
      <div className={isShow ? 'weekly-modal active' : 'weekly-modal'}>
        <h3 className='title'>
          {t('closed.scheduleTitle', { defaultValue: 'График работы' })}
        </h3>

        <div className='list'>
          {weekly.map((row) => (
            <div className={row.dow === todayDow ? 'row today' : 'row'} key={row.dow}>
              <span
                className='day'
                style={row.dow === todayDow ? { color: colorTheme, fontWeight: 600 } : undefined}
              >
                {row.label}
              </span>
              <span className='time'>{row.time.replace('–', ' - ')}</span>
            </div>
          ))}
        </div>

        <button
          style={{ backgroundColor: colorTheme }}
          className='action'
          onClick={onClose}
        >
          {t('closed.ok')}
        </button>
      </div>
    </>
  );
};

export default WeeklyScheduleModal;
