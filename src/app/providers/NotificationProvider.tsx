'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { toast } from 'react-hot-toast'

interface NotificationProviderProps {
  children: React.ReactNode
}

// Define the structure of each weather item
interface WeatherItem {
  city: string
  temperature: number
  humidity: number
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const weatherData = useSelector((state: RootState) => state.weather.data)

  useEffect(() => {
    if (!weatherData) return

    const weatherCheckInterval = setInterval(() => {
      // Ensure weatherData is an object with values
      Object.values(weatherData as Record<string, WeatherItem>).forEach((data) => {
        if (data.temperature > 35) {
          toast(`🌡️ High Temperature Alert for ${data.city}: ${data.temperature}°C`, {
            icon: '🌡️',
            id: `temp-alert-${data.city}`
          })
        }
        if (data.humidity > 85) {
          toast(`💧 High Humidity Alert for ${data.city}: ${data.humidity}%`, {
            icon: '💧',
            id: `humidity-alert-${data.city}`
          })
        }
      })
      
    }, 60000) // Check every 60 seconds

    return () => clearInterval(weatherCheckInterval)
  }, [weatherData])

  return <>{children}</>
}
