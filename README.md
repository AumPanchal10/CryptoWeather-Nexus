# CryptoWeather Nexus

A modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications via WebSocket. Built with Next.js, Redux, and Tailwind CSS.

## Features

- **Real-time Cryptocurrency Updates**
  - Live price tracking via WebSocket for Bitcoin, Ethereum, and Dogecoin
  - Historical price data visualization
  - Market cap and 24-hour price change indicators

- **Weather Information**
  - Current weather data for New York, London, and Tokyo
  - Temperature, humidity, and conditions display
  - Historical weather data tracking
  - Simulated weather alerts

- **Crypto News Feed**
  - Latest cryptocurrency news headlines
  - Direct links to full articles
  - Source attribution and timestamp display

- **Favorites System**
  - Save favorite cities and cryptocurrencies
  - Persistent storage using localStorage
  - Visual indicators for favorite items

- **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts for all screen sizes
  - Modern UI with smooth transitions

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Real-time Data**: WebSocket (CoinCap API)
- **Charts**: Recharts
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── components/         # Reusable UI components
│   ├── store/             # Redux store and slices
│   ├── city/              # City details page
│   ├── crypto/            # Crypto details page
│   ├── providers.tsx      # Redux and WebSocket providers
│   └── page.tsx           # Main dashboard page
```

## Design Decisions

- **TypeScript**: Ensures type safety and better developer experience
- **Redux Toolkit**: Simplified state management with built-in immutability
- **WebSocket Integration**: Real-time price updates for better user experience
- **Modular Components**: Reusable and maintainable code structure
- **Tailwind CSS**: Utility-first styling for rapid development
- **Responsive Design**: Mobile-first approach for all screen sizes

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## API Integration

- **Weather Data**: OpenWeatherMap API
- **Cryptocurrency Data**: CoinCap API (REST and WebSocket)
- **News Data**: NewsData.io API

## Future Improvements

- Add more cities and cryptocurrencies
- Implement user authentication
- Add more detailed historical data
- Enhanced error handling and fallback UI
- Unit tests for critical components
- PWA support for offline functionality

## Development Challenges and Solutions

- **API Rate Limiting**
  - Challenge: OpenWeatherMap and NewsData.io APIs have rate limits that could affect data fetching
  - Solution: Implemented caching strategies and optimized API calls to stay within limits

- **WebSocket Connection Management**
  - Challenge: Maintaining stable WebSocket connections for real-time crypto data
  - Solution: Added automatic reconnection logic and connection state management

- **State Management Complexity**
  - Challenge: Managing multiple data sources and real-time updates
  - Solution: Utilized Redux Toolkit for centralized state management with proper error handling

- **Dynamic Routing and Data Fetching**
  - Challenge: Implementing efficient routing for city and crypto details pages
  - Solution: Leveraged Next.js 14's app router and server components for optimal performance

## Alternative APIs

While the project primarily uses OpenWeatherMap, CoinCap, and NewsData.io, these alternatives were considered:

- **Weather Data**:
  - WeatherAPI.com: Offers similar features with different rate limits
  - Tomorrow.io: Provides additional weather metrics

- **Cryptocurrency Data**:
  - CoinGecko API: Free alternative with comprehensive crypto data
  - Binance API: Offers real-time trading data

- **News Data**:
  - CryptoCompare News API: Specialized in crypto news
  - Bing News Search API: Broader news coverage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.