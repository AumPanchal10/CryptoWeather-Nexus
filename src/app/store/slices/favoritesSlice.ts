import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'

interface FavoritesState {
  cities: string[]
  cryptos: string[]
}

// Load initial state from localStorage if available
const loadInitialState = (): FavoritesState => {
  if (typeof window === 'undefined') return { cities: [], cryptos: [] }
  
  try {
    const savedState = localStorage.getItem('favorites')
    return savedState ? JSON.parse(savedState) : { cities: [], cryptos: [] }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
    return { cities: [], cryptos: [] }
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: loadInitialState(),
  reducers: {
    toggleCityFavorite: (state, action: PayloadAction<string>) => {
      const city = action.payload
      const index = state.cities.indexOf(city)
      
      if (index === -1) {
        state.cities.push(city)
        toast.success(`Added ${city} to favorites`)
      } else {
        state.cities.splice(index, 1)
        toast.success(`Removed ${city} from favorites`)
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state))
      }
    },
    toggleCryptoFavorite: (state, action: PayloadAction<string>) => {
      const crypto = action.payload
      const index = state.cryptos.indexOf(crypto)
      
      if (index === -1) {
        state.cryptos.push(crypto)
        toast.success(`Added ${crypto} to favorites`)
      } else {
        state.cryptos.splice(index, 1)
        toast.success(`Removed ${crypto} from favorites`)
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state))
      }
    }
  }
})

export const { toggleCityFavorite, toggleCryptoFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer