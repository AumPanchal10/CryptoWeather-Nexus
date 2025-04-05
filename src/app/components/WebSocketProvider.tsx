'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePriceWebSocket, setWebsocketConnected } from '../store/slices/cryptoSlice';
import { toast } from 'react-hot-toast';

const WEBSOCKET_URL = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin';

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        dispatch(setWebsocketConnected(true));
        toast.success('Connected to crypto price feed');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          Object.entries(data).forEach(([id, price]) => {
            dispatch(updatePriceWebSocket({ id, price: parseFloat(price as string) }));
          });
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        dispatch(setWebsocketConnected(false));
        toast.error('Disconnected from crypto price feed. Reconnecting...');
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [dispatch]);

  return <>{children}</>;
}