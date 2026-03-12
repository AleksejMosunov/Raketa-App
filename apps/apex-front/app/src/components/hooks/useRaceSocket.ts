// useRaceSocket.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type RaceState = {
  trackName?: string;
  countdown?: number;
  raceData?: Record<string, unknown>;
  pits?: unknown[];
  updatedAt?: string;
};

type UseRaceSocketResult = {
  connected: boolean;
  state: RaceState | null;
  error: string | null;
  reconnect: () => void;
};

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

export function useRaceSocket(trackId: string | null): UseRaceSocketResult {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<RaceState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const reconnect = () => {
    socketRef.current?.disconnect();
    socketRef.current?.connect();
  };

  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
      }),
    [],
  );

  useEffect(() => {
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      setError(null);
      if (trackId) socket.emit("race:join", trackId);
    };

    const onDisconnect = () => setConnected(false);

    const onState = (payload: RaceState | null) => {
      if (!payload) return;
      setState(payload);
    };

    const onUpdate = (payload: RaceState) => {
      setState((prev) => ({ ...(prev ?? {}), ...payload }));
    };

    const onConnectError = (err: Error) => {
      setError(err.message || "Socket connection error");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("race:state", onState);
    socket.on("race:update", onUpdate);
    socket.on("connect_error", onConnectError);

    socket.connect();

    return () => {
      if (trackId) socket.emit("race:leave", trackId);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("race:state", onState);
      socket.off("race:update", onUpdate);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, [socket, trackId]);

  useEffect(() => {
    if (!socket.connected || !trackId) return;
    socket.emit("race:join", trackId);

    return () => {
      socket.emit("race:leave", trackId);
    };
  }, [socket, trackId]);

  return { connected, state, error, reconnect };
}
