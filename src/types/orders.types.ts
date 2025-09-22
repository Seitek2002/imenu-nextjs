/**
 * Service mode per OpenAPI:
 * 1 - На месте
 * 2 - Самовывоз
 * 3 - Доставка
 */
export type ServiceMode = 1 | 2 | 3;

/**
 * Order product in a created/read order (response)
 * Matches OpenAPI OrderProduct with nested product details.
 */
export interface IOrderProduct {
  product: {
    id: number;
    productName: string;
    productPhoto: string;
    weight: number;
  };
  count: number;
  price: string | number; // API returns decimal as string; some places may treat as number
  modificator?: number | null;
}

/**
 * Order product for request payload (creation)
 */
export interface IOrderProductCreate {
  product: number;
  count: number;
  modificator?: number;
}

/**
 * Request payload for creating an order (OpenAPI OrderCreate, writeOnly fields)
 * Notes:
 * - servicePrice is decimal string
 * - tipsPrice is integer
 * - address/comment may be null or omitted
 * - code/hash used in OTP flow
 * - useBonus/bonus per business logic
 */
export interface IReqCreateOrder {
  phone: string;
  comment?: string | null;
  serviceMode: ServiceMode;
  address?: string | null;

  servicePrice?: string; // decimal as string (writeOnly)
  tipsPrice?: number; // integer (writeOnly)

  useBonus?: boolean; // writeOnly
  bonus?: number; // integer (writeOnly)

  code?: string | null; // OTP code
  hash?: string | null; // phone verification hash

  spot?: number | null;
  table?: number | null;

  isTgBot?: boolean;
  tgRedirectUrl?: string | null;

  venue_slug: string;

  orderProducts: IOrderProductCreate[];
}

/**
 * Order list item (OpenAPI OrderList)
 */
export interface IOrder {
  id: number;
  totalPrice?: string; // decimal as string
  status: number;
  createdAt?: string; // ISO datetime
  serviceMode: ServiceMode;
  address?: string | null;
  comment?: string | null;
  phone: string;

  orderProducts: IOrderProduct[];

  tableNum?: string;
  statusText?: string;
}

/**
 * Detailed order by ID (server may return same shape as OrderList item with more fields)
 */
export interface IOrderById {
  id: number;
  phone: string;
  comment?: string | null;
  address?: string | null;
  status: number;
  serviceMode: ServiceMode;
  servicePrice?: string;
  tipsPrice?: string;
  createdAt?: string;
  orderProducts: IOrderProduct[];
  tableNum?: string;
  statusText?: string;
}

/**
 * Response for create order (OpenAPI OrderCreate readOnly fields)
 * We keep paymentUrl possibly null for safety with existing code.
 */
export interface ICreateOrderResponse {
  id: number;
  paymentUrl: string | null;
  phoneVerificationHash?: string;
}
