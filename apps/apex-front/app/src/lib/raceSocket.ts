// src/lib/raceSocket.ts
import { io, Socket } from "socket.io-client";

export const raceSocket: Socket = io(process.env.API_URL, {
  withCredentials: true,
  transports: ["websocket"], // можно убрать, если хочешь fallback на polling
});
