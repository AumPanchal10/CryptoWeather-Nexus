export interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

export interface NewsState {
  articles: NewsArticle[]
  loading: boolean
  error: string | null
}