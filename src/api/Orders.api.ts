import { ICreateOrderResponse, IOrder, IOrderById, IReqCreateOrder } from 'src/types/orders.types';

import { baseApi } from './base';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      IOrder[],
      {
        phone?: string;
        spotId?: string | number;
        tableId?: string | number;
        venueSlug?: string;
        // Cross-project compatibility:
        organizationSlug?: string;
        spotSlug?: string | number;
      }
    >({
      query: ({ phone, spotId, tableId, venueSlug, organizationSlug, spotSlug }) => {
        const params = new URLSearchParams();

        const slug = venueSlug ?? organizationSlug;
        const spot = (spotId ?? spotSlug) as string | number | undefined;

        if (phone) params.append('phone', phone);
        if (spot !== undefined && spot !== null) params.append('spotId', String(spot));
        if (tableId !== undefined && tableId !== null) params.append('tableId', String(tableId));
        if (slug) params.append('venueSlug', String(slug)); // web-menu expects venueSlug

        return `orders/?${params.toString()}`;
      },
    }),
    // Keep payload shape backward-compatible with existing code paths
    postOrders: builder.mutation<ICreateOrderResponse, IReqCreateOrder>({
      query: (newOrder) => ({
        url: 'orders/',
        method: 'POST',
        body: newOrder,
      }),
    }),
    getOrdersById: builder.query<IOrderById, { id: number }>({
      query: ({ id }) => `orders/${id}/`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  usePostOrdersMutation,
  useGetOrdersByIdQuery,
  useLazyGetOrdersByIdQuery,
} = ordersApi;
