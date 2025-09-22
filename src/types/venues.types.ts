export interface ISpot {
  id: number;
  name: string;
  address: string | null;
}

/**
 * OpenAPI: WorkSchedule
 * - dayOfWeek: 1 (Пн) .. 7 (Вс)
 * - dayName: локализованное имя дня (readOnly)
 * - workStart/workEnd: "HH:MM" | null
 * - isDayOff: выходной
 * - is24h: круглосуточно
 */
export interface IWorkSchedule {
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  dayName: string;
  workStart: string | null;
  workEnd: string | null;
  isDayOff: boolean;
  is24h: boolean;
}

export interface IVenues {
  colorTheme: string;
  companyName: string;
  slug: string;

  // OpenAPI: logo nullable
  logo: string | null;

  // Optional description for meta tags (SEO)
  description?: string | null;

  serviceFeePercent: number;

  /**
   * Legacy fallback строка расписания "HH:MM-HH:MM" (не в OpenAPI, но используется в коде).
   * При наличии массива schedules следует предпочитать его.
   */
  schedule?: string;

  /**
   * OpenAPI: массив расписаний на неделю
   * (в спецификации обязательный, но делаем опциональным для совместимости со старыми ответами/LS)
   */
  schedules?: IWorkSchedule[];

  // Информация о столе присутствует только для /venues/{slug}/table/{tableId}/
  table?: {
    id: number;
    tableNum: string;
  };

  // OpenAPI поля доставки
  defaultDeliverySpot?: number | null;
  deliveryFixedFee?: string | null; // decimal как строка
  deliveryFreeFrom?: string | null; // decimal как строка или null

  // Новое поле: HTML-строка с условиями/офертой
  terms?: string | null;

  spots?: ISpot[];

  // Локальное поле состояния (не из OpenAPI), поэтому делаем опциональным
  activeSpot?: number;

  isDeliveryAvailable: boolean;
  isTakeoutAvailable: boolean;
  isDineinAvailable: boolean;
}
