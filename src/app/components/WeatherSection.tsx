'use client'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { toggleCityFavorite } from '../store/slices/favoritesSlice'
import Link from 'next/link'
import { FaStar, FaRegStar, FaThermometerHalf, FaTint } from 'react-icons/fa'

interface WeatherSectionProps {
  cities: string[]
  data: Record<string, any>
}

export default function WeatherSection({ cities, data }: WeatherSectionProps) {
  const dispatch = useDispatch()
  const favorites = useSelector((state: RootState) => state.favorites.cities)
  const loading = useSelector((state: RootState) => state.weather.loading)

  if (loading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-xl font-semibold mb-4">Weather Information</h2>
        <div className="space-y-4">
          {cities.map((city) => (
            <div key={city} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Weather Information</h2>
      <div className="space-y-4">
        {cities.map((city) => {
          const cityData = data[city]
          const isFavorite = favorites.includes(city)

          if (!cityData) {
            return (
              <div key={city} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500">No data available for {city}</div>
              </div>
            )
          }

          return (
            <div key={city} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Link 
                  href={`/city/${encodeURIComponent(city)}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {city}
                </Link>
                <button
                  onClick={() => dispatch(toggleCityFavorite(city))}
                  className="text-yellow-500 hover:text-yellow-600 transition-colors"
                >
                  {isFavorite ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaThermometerHalf className="text-red-500" />
                  <span>{cityData.temperature?.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTint className="text-blue-500" />
                  <span>{cityData.humidity}%</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                {cityData.conditions}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}