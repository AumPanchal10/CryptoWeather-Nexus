import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  volume: number;
  circulatingSupply: number; 
  priceChange24h: number
  marketCap: number
  priceHistory?: { timestamp: number; price: number }[]
  history?: {
    timestamp: number
    price: number
  }[]
}

interface CryptoState {
  data: Record<string, CryptoData>
  loading: boolean
  error: string | null
  websocketConnected: boolean
}

const initialState: CryptoState = {
  data: {},
  loading: false,
  error: null,
  websocketConnected: false
}

const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(url)
    return response
  } catch (error: any) {
    if (error.response?.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithRetry(url, retries - 1, delay * 2)
    }
    throw error
  }
}

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (cryptoIds: string[], { rejectWithValue }) => {
    const results: Record<string, CryptoData> = {}

    try {
      const response = await fetchWithRetry(
        `https://api.coincap.io/v2/assets?ids=${cryptoIds.join(',')}`
      )

      response.data.data.forEach((crypto: any) => {
        results[crypto.id] = {
          id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          price: parseFloat(crypto.priceUsd),
          priceChange24h: parseFloat(crypto.changePercent24Hr),
          marketCap: parseFloat(crypto.marketCapUsd),
          volume: parseFloat(crypto.volumeUsd24Hr),
          circulatingSupply: parseFloat(crypto.supply),
          history: []
        }
      })

      return results
    } catch (error: any) {
      console.error('Error fetching crypto data:', error)
      if (error.response?.status === 429) {
        toast.error('Rate limit exceeded. Please try again in a moment.')
        return rejectWithValue('Rate limit exceeded. Please try again in a moment.')
      }
      toast.error('Failed to fetch cryptocurrency data')
      return rejectWithValue('Failed to fetch cryptocurrency data')
    }
  }
)

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePriceWebSocket: (state, action) => {
      const { id, price } = action.payload
      if (state.data[id]) {
        const oldPrice = state.data[id].price
        state.data[id].price = price
        
        // Add to history
        state.data[id].history = [
          ...(state.data[id].history || []),
          { timestamp: Date.now(), price }
        ].slice(-100) // Keep last 100 price updates

        // Show notification for significant price changes (>1%)
        const priceChange = ((price - oldPrice) / oldPrice) * 100
        if (Math.abs(priceChange) > 1) {
          const direction = priceChange > 0 ? 'increased' : 'decreased'
          const notification = {
            type: 'price_alert',
            message: `${state.data[id].name} price ${direction} by ${Math.abs(priceChange).toFixed(2)}%`,
            details: {
              asset: state.data[id].name,
              oldPrice: oldPrice.toFixed(2),
              newPrice: price.toFixed(2),
              percentageChange: priceChange.toFixed(2),
              timestamp: Date.now()
            }
          }
          
          toast(notification.message, {
            icon: priceChange > 0 ? '📈' : '📉',
            duration: 5000,
            id: `price-alert-${id}-${Date.now()}`,
            style: {
              background: priceChange > 0 ? '#dcfce7' : '#fee2e2',
              color: '#1f2937'
            }
          })
        }
      }
    },
    setWebsocketConnected: (state, action) => {
      state.websocketConnected = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false
        state.data = { ...state.data, ...action.payload }
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch crypto data'
      })
  }
})

export const { updatePriceWebSocket, setWebsocketConnected } = cryptoSlice.actions
export default cryptoSlice.reducer