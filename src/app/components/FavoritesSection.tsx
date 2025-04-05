'use client'

import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import Link from 'next/link'
import { FaStar, FaThermometerHalf, FaTint, FaArrowUp, FaArrowDown } from 'react-icons/fa'

export default function FavoritesSection() {
  const favorites = useSelector((state: RootState) => state.favorites)
  const weatherData = useSelector((state: RootState) => state.weather.data)
  const cryptoData = useSelector((state: RootState) => state.crypto.data)

  const hasFavorites = favorites.cities.length > 0 || favorites.cryptos.length > 0

  if (!hasFavorites) {
    return (
      <div className="card bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Favorites
        </h2>
        <p className="text-gray-500 text-center py-4">
          No favorites yet. Click the star icon on any city or cryptocurrency to add it to your favorites.
        </p>
      </div>
    )
  }

  return (
    <div className="card bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaStar className="text-yellow-500" />
        Favorites
      </h2>

      {favorites.cities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Favorite Cities</h3>
          <div className="space-y-3">
            {favorites.cities.map((city) => {
              const cityData = weatherData[city]
              if (!cityData) return null

              return (
                <div key={city} className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
                  <Link
                    href={`/city/${encodeURIComponent(city)}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {city}
                  </Link>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <FaThermometerHalf className="text-red-500" />
                      <span>{cityData.temperature?.toFixed(1)}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTint className="text-blue-500" />
                      <span>{cityData.humidity}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {favorites.cryptos.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Favorite Cryptocurrencies</h3>
          <div className="space-y-3">
            {favorites.cryptos.map((cryptoId) => {
              const crypto = cryptoData[cryptoId]
              if (!crypto) return null

              const priceChangeIsPositive = crypto.priceChange24h > 0

              return (
                <div key={cryptoId} className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
                  <Link
                    href={`/crypto/${cryptoId}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {crypto.name}
                  </Link>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-lg font-semibold">
                      ${crypto.price.toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-1 ${priceChangeIsPositive ? 'text-success' : 'text-error'}`}>
                      {priceChangeIsPositive ? <FaArrowUp /> : <FaArrowDown />}
                      <span>{Math.abs(crypto.priceChange24h).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}