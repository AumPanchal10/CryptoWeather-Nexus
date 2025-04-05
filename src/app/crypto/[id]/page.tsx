'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'
import { fetchCryptoData } from '@/app/store/slices/cryptoSlice'
import { toggleCryptoFavorite } from '@/app/store/slices/favoritesSlice'
import { FaStar, FaRegStar, FaArrowLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PageProps {
  params: {
    id: string
  }
}

export default function CryptoDetailPage({ params }: PageProps) {
  const dispatch = useDispatch()
  const cryptoId = decodeURIComponent(params.id)
  const cryptoData = useSelector((state: RootState) => state.crypto.data[cryptoId])
  const loading = useSelector((state: RootState) => state.crypto.loading)
  const favorites = useSelector((state: RootState) => state.favorites.cryptos)
  const isFavorite = favorites.includes(cryptoId)

  useEffect(() => {
    if (!cryptoData) {
      dispatch(fetchCryptoData([cryptoId]) as any)
    }
  }, [cryptoId, dispatch, cryptoData])

  if (loading || !cryptoData) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-background">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 w-48 mb-4 rounded"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const priceChangeIsPositive = cryptoData.priceChange24h > 0

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
      >
        <FaArrowLeft />
        <span>Back to Dashboard</span>
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">{cryptoData.name} Details</h1>
          <button
            onClick={() => dispatch(toggleCryptoFavorite(cryptoId))}
            className="text-2xl text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-xl mb-2">Current Price</div>
            <div className="text-4xl font-bold">${cryptoData.price.toFixed(2)}</div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-xl mb-2">24h Change</div>
            <div className={`text-4xl font-bold flex items-center gap-2 ${priceChangeIsPositive ? 'text-success' : 'text-error'}`}>
              {priceChangeIsPositive ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(cryptoData.priceChange24h).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-xl mb-2">Market Cap</div>
            <div className="text-2xl font-bold">
              ${(cryptoData.marketCap / 1e9).toFixed(2)}B
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-xl mb-2">Volume (24h)</div>
            <div className="text-2xl font-bold">
              ${(cryptoData.volume / 1e9).toFixed(2)}B
            </div>
          </div>
        </div>

        {cryptoData.priceHistory && cryptoData.priceHistory.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Price History</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cryptoData.priceHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                    formatter={(value: any) => [`$${value}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#1a73e8" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}