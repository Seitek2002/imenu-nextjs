import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import i18n from 'i18next';

const baseUrl =
  (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'https://imenu.kg/api/';

// Guard for SSR: localStorage and window are not available on the server
const isBrowser = typeof window !== 'undefined';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const lngFromI18n = i18n?.language && i18n.language.length ? i18n.language : undefined;
      const lngFromLS =
        isBrowser ? (window.localStorage?.getItem('i18nextLng') || undefined) : undefined;
      const currentLanguage = lngFromI18n ?? lngFromLS ?? 'ru';
      headers.set('Accept-Language', currentLanguage);
      return headers;
    },
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
