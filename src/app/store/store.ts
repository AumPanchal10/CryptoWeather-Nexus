import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from './slices/weatherSlice'
import cryptoReducer from './slices/cryptoSlice'
import newsReducer from './slices/newsSlice'
import favoritesReducer from './slices/favoritesSlice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    favorites: favoritesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for WebSocket connections
        ignoredActions: ['crypto/updatePriceWebSocket'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch