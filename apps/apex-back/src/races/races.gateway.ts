/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RacesService } from './races.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class RacesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private racesService: RacesService) {}

  afterInit() {
    this.racesService.setGateway(this);
    console.log('⚙️ RacesGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('race:join')
  joinRace(client: Socket, trackId: string) {
    const room = `race:${trackId}`;
    client.join(room);
    console.log(`✅ Client ${client.id} joined ${room}`);

    // Отправить текущее состояние гонки
    const raceState = this.racesService.getRaceState(trackId);
    client.emit('race:state', raceState);
  }

  @SubscribeMessage('race:leave')
  leaveRace(client: Socket, trackId: string) {
    const room = `race:${trackId}`;
    client.leave(room);
    console.log(`❌ Client ${client.id} left ${room}`);
  }

  // Публичный метод для отправки обновлений из raceStarter
  broadcastRaceUpdate(trackId: string, payload: unknown) {
    this.server.to(`race:${trackId}`).emit('race:update', payload);
  }
}
