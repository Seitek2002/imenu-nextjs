import { baseApi } from './base';

export interface IClientBonus {
  phoneNumber: string;
  bonus: number;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientBonus: builder.query<IClientBonus, { phone: string; venueSlug?: string; organizationSlug?: string }>({
      query: ({ phone, venueSlug, organizationSlug }) => ({
        url: 'client/bonus/',
        method: 'GET',
        params: {
          phone,
          ...(venueSlug ? { venue_slug: venueSlug } : {}),
          ...(organizationSlug ? { organization_slug: organizationSlug } : {}),
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientBonusQuery } = clientApi;
