'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'
import { fetchWeatherData } from '@/app/store/slices/weatherSlice'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FaArrowLeft, FaThermometerHalf, FaTint } from 'react-icons/fa'
import Link from 'next/link'

interface PageProps {
  params: {
    name: string
  }
}

export default function CityPage({ params }: PageProps) {
  const dispatch = useDispatch()
  const cityName = decodeURIComponent(params.name)
  const cityData = useSelector((state: RootState) => state.weather.data[cityName])
  const loading = useSelector((state: RootState) => state.weather.loading)

  useEffect(() => {
    if (!cityData) {
      dispatch(fetchWeatherData([cityName]) as any)
    }
  }, [cityName, dispatch, cityData])

  if (loading || !cityData) {
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
        <h1 className="text-3xl font-bold mb-8">{cityName} Weather Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <FaThermometerHalf className="text-red-500" />
              <span>Temperature</span>
            </div>
            <div className="text-4xl font-bold">{cityData.temperature.toFixed(1)}°C</div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <FaTint className="text-blue-500" />
              <span>Humidity</span>
            </div>
            <div className="text-4xl font-bold">{cityData.humidity}%</div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Weather Conditions</h2>
          <div className="p-4 bg-gray-50 rounded-lg text-lg">
            {cityData.conditions}
          </div>
        </div>

        {cityData.history && cityData.history.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Temperature History</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cityData.history}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleString()}
                    formatter={(value: any) => [`${value}°C`, 'Temperature']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
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