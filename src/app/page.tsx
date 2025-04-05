'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/store'
import { fetchWeatherData, simulateWeatherAlert } from './store/slices/weatherSlice'
import { fetchCryptoData } from './store/slices/cryptoSlice'
import { fetchNewsData } from './store/slices/newsSlice'
import WeatherSection from './components/WeatherSection'
import CryptoSection from './components/CryptoSection'
import NewsSection from './components/NewsSection'
import FavoritesSection from './components/FavoritesSection'

const CITIES = ['New York', 'London', 'Tokyo']
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'dogecoin']

export default function Dashboard() {
  const dispatch = useDispatch()
  const weatherData = useSelector((state: RootState) => state.weather.data)
  const cryptoData = useSelector((state: RootState) => state.crypto.data)

  useEffect(() => {
    // Set up periodic data refresh
    const refreshInterval = setInterval(() => {
      dispatch(fetchWeatherData(CITIES) as any)
      dispatch(fetchCryptoData(CRYPTO_IDS) as any)
      dispatch(fetchNewsData() as any)
    }, 60000) // Refresh every minute

    // Simulate random weather alerts
    const alertInterval = setInterval(() => {
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)]
      const alerts = [
        'Heavy rain expected',
        'High temperature warning',
        'Strong winds alert',
        'Storm approaching'
      ]
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)]
      dispatch(simulateWeatherAlert({ city: randomCity, alert: randomAlert }))
    }, 300000) // Every 5 minutes

    return () => {
      clearInterval(refreshInterval)
      clearInterval(alertInterval)
    }
  }, [])

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <h1 className="text-3xl font-bold text-primary mb-8">CryptoWeather Nexus</h1>
      
      <div className="space-y-6">
        <FavoritesSection />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeatherSection cities={CITIES} data={weatherData} />
              <CryptoSection cryptos={CRYPTO_IDS} data={cryptoData} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <NewsSection />
          </div>
        </div>
      </div>
    </main>
  )
}