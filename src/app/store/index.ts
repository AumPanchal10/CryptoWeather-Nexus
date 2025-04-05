import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import cryptoReducer from './slices/cryptoSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;