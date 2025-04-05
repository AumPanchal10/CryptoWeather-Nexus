'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { fetchCryptoData } from '@/app/store/slices/cryptoSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowLeft, FaDollarSign, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

interface PageProps {
  params: {
    symbol: string
  }
}

export default function CryptoPage({ params }: PageProps) {
  const dispatch = useDispatch();
  const symbol = decodeURIComponent(params.symbol).toLowerCase();
  const displaySymbol = symbol.toUpperCase();

  const cryptoData = useSelector((state: RootState) => state.crypto.data[symbol]);
  const loading = useSelector((state: RootState) => state.crypto.loading);
  const error = useSelector((state: RootState) => state.crypto.error);

  useEffect(() => {
    const fetchData = () => {
      if (!cryptoData || Object.keys(cryptoData).length === 0) {
        dispatch(fetchCryptoData([symbol]) as any);
      }
    };

    // Initial fetch
    fetchData();

    // Set up periodic refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      dispatch(fetchCryptoData([symbol]) as any);
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, [symbol, dispatch]);

  if (loading || !cryptoData || Object.keys(cryptoData).length === 0) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-background">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 w-48 mb-4 rounded"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-background text-red-600">
        <p>Error loading data: {error}</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">Go Back</Link>
      </div>
    );
  }

  const priceChangeColor = cryptoData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';

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
        <h1 className="text-3xl font-bold mb-8">{displaySymbol} Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <FaDollarSign className="text-green-500" />
              <span>Current Price</span>
            </div>
            <div className="text-4xl font-bold">
              ${cryptoData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <FaChartLine className={priceChangeColor} />
              <span>24h Change</span>
            </div>
            <div className={`text-4xl font-bold ${priceChangeColor}`}>
              {cryptoData.priceChange24h >= 0 ? '+' : ''}{cryptoData.priceChange24h.toFixed(2)}%
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <FaExchangeAlt className="text-blue-500" />
              <span>24h Volume</span>
            </div>
            <div className="text-4xl font-bold">
              ${(cryptoData.volume?.toFixed(2) || '0.00')}M
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Market Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600">Market Cap:</span>
              <span className="ml-2 font-semibold">
                ${(cryptoData.marketCap / 1_000_000_000).toFixed(2)}B
              </span>
            </div>
            <div>
              <span className="text-gray-600">Circulating Supply:</span>
              <span className="ml-2 font-semibold">
                {(cryptoData.circulatingSupply / 1_000_000).toFixed(2)}M {displaySymbol}
              </span>
            </div>
          </div>
        </div>

        {cryptoData.history && cryptoData.history.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Price History</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cryptoData.history}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => {
                      const date = new Date(timestamp);
                      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                    }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                    formatter={(value: any) => [`$${parseFloat(value).toLocaleString()}`, 'Price']}
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
  );
}
