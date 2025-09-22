import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import i18n from 'i18next';

const baseUrl =
  (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'https://imenu.kg/api/';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const currentLanguage =
        i18n.language || localStorage.getItem('i18nextLng') || 'en';
      headers.set('Accept-Language', currentLanguage);
      return headers;
    },
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
