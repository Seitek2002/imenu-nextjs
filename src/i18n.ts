'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import kg from './locales/kg/translation.json';
import ru from './locales/ru/translation.json';
import LanguageDetector from 'i18next-browser-languagedetector';

// Ensure this file only runs in the browser (avoids SSR using window/localStorage)
const isBrowser = typeof window !== 'undefined';

// Use language detector only in the browser
if (isBrowser) {
  i18n.use(LanguageDetector);
}

i18n.use(initReactI18next).init({
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
  // Configure detection only when in browser to avoid touching localStorage/navigator on server
  ...(isBrowser
    ? {
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
        },
      }
    : {}),
});

export default i18n;
