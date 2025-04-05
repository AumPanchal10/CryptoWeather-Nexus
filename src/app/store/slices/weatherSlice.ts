import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface WeatherData {
  city: string
  temperature: number
  humidity: number
  conditions: string
  history?: {
    date: string
    temperature: number
    humidity: number
  }[]
}

interface WeatherState {
  data: Record<string, WeatherData>
  loading: boolean
  error: string | null
}

const initialState: WeatherState = {
  data: {},
  loading: false,
  error: null
}

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (cities: string[], { rejectWithValue }) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    if (!API_KEY) {
      toast.error('Weather API key is not configured')
      return rejectWithValue('API key is missing')
    }

    const results: Record<string, WeatherData> = {}
    const errors: string[] = []

    await Promise.all(
      cities.map(async (city) => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          )

          if (!response.data || !response.data.main || !response.data.weather) {
            throw new Error('Invalid API response format')
          }

          results[city] = {
            city,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            conditions: response.data.weather[0].main,
            history: []
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
          console.error(`Error fetching weather for ${city}:`, errorMessage)
          errors.push(`${city}: ${errorMessage}`)
        }
      })
    )

    if (Object.keys(results).length === 0) {
      const errorMessage = `Failed to fetch weather data: ${errors.join(', ')}`
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }

    return results
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    simulateWeatherAlert: (state, action) => {
      const { city, alert } = action.payload
      const notification = {
        type: 'weather_alert',
        message: `Weather Alert for ${city}: ${alert}`,
        details: {
          city,
          alertType: alert,
          timestamp: Date.now(),
          currentConditions: state.data[city]?.conditions || 'Unknown'
        }
      }
      
      toast(notification.message, {
        icon: '⚠️',
        id: `weather-alert-${city}-${Date.now()}`,
        duration: 7000,
        style: {
          background: '#fef3c7',
          color: '#1f2937'
        }
      })
      
    },
    updateWeatherHistory: (state, action) => {
      const { city, data } = action.payload
      if (state.data[city]) {
        state.data[city].history = [
          ...(state.data[city].history || []),
          {
            date: new Date().toISOString(),
            temperature: data.temperature,
            humidity: data.humidity
          }
        ].slice(-24) // Keep last 24 records
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false
        state.data = { ...state.data, ...action.payload }
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch weather data'
      })
  }
})

export const { simulateWeatherAlert, updateWeatherHistory } = weatherSlice.actions
export default weatherSlice.reducer