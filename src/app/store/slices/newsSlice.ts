import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import { NewsArticle, NewsState } from '../types/news'

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null
}

let cachedArticles: NewsArticle[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      const currentTime = Date.now();
      if (cachedArticles && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
        return cachedArticles;
      }

      const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY
      if (!API_KEY) {
        toast.error('News API key is not configured')
        return rejectWithValue('API key is missing')
      }

      const response = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en&category=business`
      )

      // Handle rate limit response
      if (response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.')
        return rejectWithValue('Rate limit exceeded')
      }

      if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
        throw new Error('Invalid API response format')
      }

      const articles = response.data.results.slice(0, 5).map((article: any) => {
        if (!article.title || !article.link) {
          throw new Error('Invalid article data format')
        }
        return {
          title: article.title,
          description: article.description || 'No description available',
          url: article.link,
          publishedAt: article.pubDate || new Date().toISOString(),
          source: article.source_id || 'Unknown Source'
        }
      })

      if (articles.length === 0) {
        toast('No news articles found', { icon: '⚠️' })
      }

      cachedArticles = articles;
      lastFetchTime = currentTime;

      return articles
    } catch (error: any) {
      // Handle rate limit error
      if (error.response?.status === 429) {
        const errorMessage = 'Rate limit exceeded. Please try again later.'
        console.error('News API rate limit exceeded')
        toast.error(errorMessage)
        return rejectWithValue(errorMessage)
      }

      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      console.error('Error fetching news:', errorMessage)
      toast.error(`Failed to fetch news data: ${errorMessage}`)
      return rejectWithValue(errorMessage)
    }
  }
)

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false
        state.articles = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch news data'
      })
  }
})

export default newsSlice.reducer