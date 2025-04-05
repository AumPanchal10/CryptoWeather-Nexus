'use client'

import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updatePriceWebSocket, setWebsocketConnected, fetchCryptoData } from '../store/slices/cryptoSlice'
import { toast } from 'react-hot-toast'

interface WebSocketProviderProps {
  children: React.ReactNode
  cryptoIds: string[]
}

interface NotificationPayload {
  type: 'price_alert' | 'weather_alert'
  message: string
  details: Record<string, any>
}

const MAX_RETRIES = 5
const RETRY_DELAY = 3000 // 3 seconds
const FALLBACK_REFRESH_INTERVAL = 60000 // 60 seconds

export default function WebSocketProvider({ children, cryptoIds }: WebSocketProviderProps) {
  const dispatch = useDispatch()
  const wsRef = useRef<WebSocket | null>(null)
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      wsRef.current = new WebSocket('wss://ws.coincap.io/prices?assets=' + cryptoIds.join(','))

      wsRef.current.onopen = () => {
        retryCountRef.current = 0
        setIsUsingFallback(false)
        dispatch(setWebsocketConnected(true))
        toast.success('Connected to crypto price feed')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          Object.entries(data).forEach(([id, price]) => {
            dispatch(updatePriceWebSocket({
              id,
              price: parseFloat(price as string)
            }))
          })
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
          toast.error('Error processing crypto data')
        }
      }

      wsRef.current.onclose = () => {
        dispatch(setWebsocketConnected(false))
        handleReconnect()
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error)
        dispatch(setWebsocketConnected(false))
        toast.error('Connection error occurred')
        wsRef.current?.close()
      }
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      handleReconnect()
    }
  }

  const handleReconnect = () => {
    if (retryCountRef.current >= MAX_RETRIES) {
      setIsUsingFallback(true)
      toast.error('Switching to fallback mode with periodic updates')
      return
    }

    retryCountRef.current += 1
    toast.error(`Disconnected from crypto feed. Retrying (${retryCountRef.current}/${MAX_RETRIES})...`)

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    retryTimeoutRef.current = setTimeout(() => {
      connect()
    }, RETRY_DELAY)
  }

  useEffect(() => {
    connect()

    // Set up fallback polling when WebSocket fails
    let fallbackInterval: NodeJS.Timeout | null = null

    if (isUsingFallback) {
      fallbackInterval = setInterval(() => {
        dispatch(fetchCryptoData(cryptoIds) as any)
      }, FALLBACK_REFRESH_INTERVAL)

      // Initial fetch when switching to fallback mode
      dispatch(fetchCryptoData(cryptoIds) as any)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval)
      }
    }
  }, [dispatch, cryptoIds, isUsingFallback])

  return <>{children}</>
}