'use client';

import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import kg from './locales/kg/translation.json';
import ru from './locales/ru/translation.json';

// Ensure this module is safe under SSR by avoiding any browser-only package imports at module scope
const isBrowser = typeof window !== 'undefined';

const baseConfig: InitOptions = {
  fallbackLng: 'ru',
  supportedLngs: ['ru', 'en', 'kg'],
  debug: false,
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    kg: { translation: kg },
  },
  interpolation: {
    escapeValue: false,
  },
};

if (isBrowser) {
  // Dynamically import browser language detector only in the browser
  import('i18next-browser-languagedetector')
    .then(({ default: LanguageDetector }) => {
      i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          ...baseConfig,
          detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
          },
        });
    })
    .catch(() => {
      // In case the detector fails to load, init without it
      i18n.use(initReactI18next).init(baseConfig);
    });
} else {
  // Server-side: init without any browser detectors
  i18n.use(initReactI18next).init(baseConfig);
}

export default i18n;
