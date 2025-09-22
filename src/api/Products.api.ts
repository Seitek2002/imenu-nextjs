import { IProduct } from 'src/types/products.types';

import { baseApi } from './base';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IProduct[],
      {
        category?: number;
        search?: string;
        spotId?: string | number;
        // Backward compatibility alias:
        spotSlug?: string | number;
        // Slug aliasing between projects:
        venueSlug?: string;
        organizationSlug?: string;
      }
    >({
      query: ({ category, search, spotId, spotSlug, venueSlug, organizationSlug }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', String(category));
        if (search) params.append('search', search);

        const spot = (spotId ?? spotSlug) as string | number | undefined;
        const slug = venueSlug ?? organizationSlug;

        if (spot !== undefined && spot !== null) params.append('spotId', String(spot));
        if (slug) params.append('venueSlug', String(slug));

        return `products/?${params.toString()}`;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery } = productsApi;
