import { configureStore } from '@reduxjs/toolkit';

import yourReducer from './yourFeatureSlice';

import { baseApi } from 'src/api';

const store = configureStore({
  reducer: {
    yourFeature: yourReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

export default store;
