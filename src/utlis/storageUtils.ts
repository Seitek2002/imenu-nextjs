import { IFoodCart } from 'types/products.types';
import { IVenues } from 'types/venues.types';

import { IUsersData } from 'src/store/yourFeatureSlice';

/**
 * SSR-safe localStorage helpers
 */
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParse = <T>(val: string | null, fallback: T): T => {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
};

const getItem = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    return safeParse<T>(window.localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
};

const setItem = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (quota, disabled, etc.)
  }
};

export const saveCartToStorage = (cart: IFoodCart[]) => {
  setItem('cartItems', cart);
};

export const loadCartFromStorage = (): IFoodCart[] => {
  return getItem<IFoodCart[]>('cartItems', []);
};

export const saveUsersDataToStorage = (users: IUsersData) => {
  setItem('users', users);
};

export const loadUsersDataFromStorage: () => IUsersData = () => {
  return getItem<IUsersData>('users', {
    phoneNumber: '',
    address: '',
    comment: '',
    name: '',
    activeSpot: 0,
  });
};

export const saveVenueToStorage = (venue: IVenues) => {
  setItem('venue', venue);
};

export const loadVenueFromStorage: () => IVenues = () => {
  return getItem<IVenues>('venue', {
    colorTheme: '#875AFF',
    companyName: '',
    slug: '',
    logo: '',
    // базовый процент обслуживания (fallback)
    serviceFeePercent: 0,
    // новые проценты по режимам обслуживания
    dineinServiceFeePercent: 0,
    takeoutServiceFeePercent: 0,
    deliveryServiceFeePercent: 0,
    isDeliveryAvailable: false,
    isTakeoutAvailable: false,
    isDineinAvailable: false,
    schedule: '',
    table: {
      id: 0,
      tableNum: '',
    },
  });
};
