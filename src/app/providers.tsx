'use client'

import { Provider } from 'react-redux'
import { store } from './store/store'
import WebSocketProvider from './providers/WebSocketProvider'
import NotificationProvider from './providers/NotificationProvider'
import { useEffect } from 'react'
import { fetchCryptoData } from './store/slices/cryptoSlice'
import { fetchWeatherData } from './store/slices/weatherSlice'
import { fetchNewsData } from './store/slices/newsSlice'

const CRYPTO_IDS = ['bitcoin', 'ethereum', 'dogecoin']
const CITIES = ['New York', 'London', 'Tokyo']

function StoreInitializer() {
  useEffect(() => {
    // Initial data fetch
    store.dispatch(fetchCryptoData(CRYPTO_IDS) as any)
    store.dispatch(fetchWeatherData(CITIES) as any)
    store.dispatch(fetchNewsData() as any)
  }, [])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer />
      <WebSocketProvider cryptoIds={CRYPTO_IDS}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </WebSocketProvider>
    </Provider>
  )
}