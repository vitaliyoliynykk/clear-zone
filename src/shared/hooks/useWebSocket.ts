import { useEffect, useRef } from 'react';

import { ACCESS_TOKEN_KEY } from '../constants/tokens';
import { WsDataModel } from '../models/ws-data-model';

export function useWebSocket(onMessage: (data: WsDataModel) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const wsIsOpenRef = useRef<boolean>(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    let ws: WebSocket | null = null;

    if (token) {
      ws = new WebSocket(import.meta.env.VITE_WS_URL as string, ['jwt', token]);

      wsRef.current = ws;

      ws.onopen = () => {
        wsIsOpenRef.current = true;

        queueRef.current.forEach((msg) => {
          ws?.send(msg);
        });
        queueRef.current = [];
      };

      ws.onmessage = (e: MessageEvent<string>) => {
        onMessage(JSON.parse(e.data) as WsDataModel);
      };

      ws.onclose = (event) => {
        console.log('ws closed', event.code);
        wsIsOpenRef.current = false;
      };
    }

    return () => {
      ws?.close();
    };
  }, [onMessage]);

  const send = (msg: unknown) => {
    const payload = JSON.stringify(msg);

    if (wsIsOpenRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload);
    } else {
      queueRef.current.push(payload);
    }
  };

  return { send };
}
