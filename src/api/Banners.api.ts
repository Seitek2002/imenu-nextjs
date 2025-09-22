import { baseApi } from './base';

export interface IBanner {
  id: number;
  title: string;
  text: string;
  banner: string;
  image: string;
  url: string;
}

export const bannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<IBanner[], { venueSlug?: string; organizationSlug?: string }>({
      query: ({ venueSlug, organizationSlug }) => ({
        url: 'banners/',
        method: 'GET',
        params: {
          // Web-menu backend expects `venueSlug`; allow `organizationSlug` for parity
          venueSlug: venueSlug ?? organizationSlug,
        },
      }),
    }),
    addBanner: builder.mutation<IBanner, Partial<IBanner>>({
      query: (newBanner) => ({
        url: 'banners/',
        method: 'POST',
        body: newBanner,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBannersQuery, useAddBannerMutation } = bannersApi;
