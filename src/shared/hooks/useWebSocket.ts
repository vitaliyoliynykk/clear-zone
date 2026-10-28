import { useEffect, useRef } from 'react';

import { toaster } from '@/components/ui/toaster';

import { ACCESS_TOKEN_KEY } from '../constants/tokens';
import { WsDataModel } from '../models/ws-data-model';

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;

const canConnect = () =>
  navigator.onLine && document.visibilityState === 'visible';

/**
 * Maintains an authenticated WebSocket connection while the page is online and
 * visible.
 *
 * Unexpected connection closures are retried with exponential backoff. The
 * connection is also replaced when the page is restored, returns to the
 * foreground, or comes back online so that PWAs recover from suspended or
 * stale sockets. Messages sent while disconnected are queued and flushed after
 * the next connection opens.
 *
 * @param onMessage Called with each parsed WebSocket message received by the
 * active connection.
 * @param onClosed Called when the active connection closes unexpectedly or the
 * browser goes offline. It is not called for lifecycle-driven socket
 * replacement or hook cleanup.
 * @returns A `send` function that serializes its value as JSON and either sends
 * it immediately or queues it until a connection opens.
 */
export const useWebSocket = (
  onMessage: (data: WsDataModel) => void,
  onClosed?: () => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const wsIsOpenRef = useRef<boolean>(false);
  const queueRef = useRef<string[]>([]);
  const onMessageRef = useRef(onMessage);
  const onClosedRef = useRef(onClosed);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onClosedRef.current = onClosed;
  }, [onMessage, onClosed]);

  useEffect(() => {
    let reconnectAttempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;

    const clearReconnectTimer = () => {
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const scheduleReconnect = () => {
      if (isDisposed || reconnectTimer !== null || !canConnect()) {
        return;
      }

      const delay = Math.min(
        INITIAL_RECONNECT_DELAY_MS * 2 ** reconnectAttempt,
        MAX_RECONNECT_DELAY_MS
      );
      reconnectAttempt += 1;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, delay);
    };

    const connect = () => {
      if (isDisposed || !canConnect()) {
        return;
      }

      const currentSocket = wsRef.current;
      if (
        currentSocket?.readyState === WebSocket.OPEN ||
        currentSocket?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        return;
      }

      clearReconnectTimer();

      const ws = new WebSocket(import.meta.env.VITE_WS_URL as string, [
        'jwt',
        token,
      ]);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isDisposed || wsRef.current !== ws) {
          return;
        }

        reconnectAttempt = 0;
        wsIsOpenRef.current = true;

        const queuedMessages = queueRef.current;
        queueRef.current = [];
        queuedMessages.forEach((msg) => {
          ws.send(msg);
        });
      };

      ws.onmessage = (event: MessageEvent<string>) => {
        if (wsRef.current === ws) {
          onMessageRef.current(JSON.parse(event.data) as WsDataModel);
        }
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) {
          return;
        }

        wsRef.current = null;
        wsIsOpenRef.current = false;
        onClosedRef.current?.();
        scheduleReconnect();
      };
    };

    const reconnect = () => {
      clearReconnectTimer();

      const previousSocket = wsRef.current;
      wsRef.current = null;
      wsIsOpenRef.current = false;
      previousSocket?.close();

      reconnectAttempt = 0;
      connect();

      toaster.create({
        description: `WebSocket reconnected`,
        type: 'info',
        duration: 2000,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        reconnect();
      }
    };

    const handleOffline = () => {
      clearReconnectTimer();

      const previousSocket = wsRef.current;
      wsRef.current = null;
      wsIsOpenRef.current = false;
      previousSocket?.close();
      onClosedRef.current?.();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', reconnect);
    window.addEventListener('online', reconnect);
    window.addEventListener('offline', handleOffline);

    connect();

    return () => {
      isDisposed = true;
      clearReconnectTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', reconnect);
      window.removeEventListener('online', reconnect);
      window.removeEventListener('offline', handleOffline);

      const ws = wsRef.current;
      wsRef.current = null;
      wsIsOpenRef.current = false;
      ws?.close();
    };
  }, []);

  const send = (msg: unknown) => {
    const payload = JSON.stringify(msg);

    if (wsIsOpenRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload);
    } else {
      queueRef.current.push(payload);
    }
  };

  return { send };
};
