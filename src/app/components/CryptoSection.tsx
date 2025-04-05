'use client'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { toggleCryptoFavorite } from '../store/slices/favoritesSlice'
import Link from 'next/link'
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown } from 'react-icons/fa'

interface CryptoSectionProps {
  cryptos: string[]
  data: Record<string, any>
}

export default function CryptoSection({ cryptos, data }: CryptoSectionProps) {
  const dispatch = useDispatch()
  const favorites = useSelector((state: RootState) => state.favorites.cryptos)
  const loading = useSelector((state: RootState) => state.crypto.loading)
  const websocketConnected = useSelector((state: RootState) => state.crypto.websocketConnected)

  if (loading) {
    return (
      <div className="card animate-pulse">
        <h2 className="text-xl font-semibold mb-4">Cryptocurrency Prices</h2>
        <div className="space-y-4">
          {cryptos.map((crypto) => (
            <div key={crypto} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cryptocurrency Prices</h2>
        <div className={`h-2 w-2 rounded-full ${websocketConnected ? 'bg-success' : 'bg-error'}`} 
          title={websocketConnected ? 'Live updates connected' : 'Live updates disconnected'} />
      </div>
      
      <div className="space-y-4">
        {cryptos.map((cryptoId) => {
          const cryptoData = data[cryptoId]
          const isFavorite = favorites.includes(cryptoId)

          if (!cryptoData) return null

          const priceChangeIsPositive = cryptoData.priceChange24h > 0

          return (
            <div key={cryptoId} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Link 
                  href={`/crypto/${cryptoId}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {cryptoData.name}
                </Link>
                <button
                  onClick={() => dispatch(toggleCryptoFavorite(cryptoId))}
                  className="text-yellow-500 hover:text-yellow-600 transition-colors"
                >
                  {isFavorite ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-lg font-semibold">
                  ${cryptoData.price.toFixed(2)}
                </div>
                <div className={`flex items-center gap-1 ${priceChangeIsPositive ? 'text-success' : 'text-error'}`}>
                  {priceChangeIsPositive ? <FaArrowUp /> : <FaArrowDown />}
                  <span>{Math.abs(cryptoData.priceChange24h).toFixed(2)}%</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Market Cap: ${(cryptoData.marketCap / 1e9).toFixed(2)}B
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}