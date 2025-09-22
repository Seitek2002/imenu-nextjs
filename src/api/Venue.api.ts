import { IVenues } from 'src/types/venues.types';

import { baseApi } from './base';

export const venuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenue: builder.query<
      IVenues,
      { venueSlug?: string; organizationSlug?: string; tableId?: string | number }
    >({
      query: ({ venueSlug, organizationSlug, tableId }) => {
        const slug = venueSlug ?? organizationSlug ?? '';
        if (!tableId) return `venues/${slug}/`;
        if (!slug || !tableId) return `venues/`;
        return `venues/${slug}/table/${tableId}/`;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetVenueQuery } = venuesApi;
