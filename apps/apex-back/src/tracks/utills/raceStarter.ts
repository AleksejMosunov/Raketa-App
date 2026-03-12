// raceStarter.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import WebSocket from 'ws';
import type { WebSocket as WebSocketType } from 'ws';
import { Track } from '../schemas/track.schema';
import { parseLapTime } from './functions';

// ===== Типы =====
interface RaceTeamData {
  teamName?: string;
  segments: Array<Record<string, unknown>>;
  pitStatus?: 'in' | 'out';
  laps?: number[];
  currentLapStart?: number;
  pitTime?: string;
  [key: string]: unknown;
}

interface RaceData {
  [teamId: string]: RaceTeamData;
}

interface ActiveRace {
  ws: WebSocketType;
  raceData: RaceData;
  countdown?: number;
  pits: unknown[];
  trackName: string;
}

// ===== Хранилище активных гонок =====
export const activeRaces: { [trackId: string]: ActiveRace } = {};

let raceGateway: any = null;

export function setRaceGateway(gateway: any) {
  raceGateway = gateway;
}

export function stopRaceSession(trackId: string): boolean {
  const race = activeRaces[trackId];
  if (!race) return false;

  race.ws.close();
  delete activeRaces[trackId];
  return true;
}

// ===== Основная функция =====
export function startRace(
  track: Track,
): Promise<{ track: Track; timestamp: string }> {
  return new Promise((resolve, reject) => {
    if (!track) return reject(new Error('Track is required'));
    if (!track.wsUrl) return reject(new Error('Track wsUrl is missing'));

    const ws = new WebSocket(track.wsUrl) as WebSocketType;

    const raceData: RaceData = {};
    let countdown: number | undefined;
    const pits: unknown[] = [];

    const trackIdObj = track._id;
    if (!trackIdObj) return reject(new Error('Unable to get track ID'));
    const trackId = trackIdObj.toString();

    ws.on('open', () => console.log(`✅ WS connected to ${track.name}`));

    ws.on('message', (data: WebSocket.RawData) => {
      // The race may be stopped while WS messages are still in flight.
      if (!activeRaces[trackId]) return;

      let messageString: string;
      if (data instanceof Buffer) {
        messageString = data.toString();
      } else if (typeof data === 'string') {
        messageString = data;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        messageString = String(data);
      }
      const lines = messageString.trim().split(/\r?\n/);

      lines.forEach((lineRaw) => {
        const line = lineRaw.trim();
        if (!line) return;

        // ================= COUNTDOWN =================
        if (line.startsWith('dyn1|countdown|')) {
          const parts = line.split('|');
          const ms = parseInt(parts[2], 10);
          countdown = ms;
          if (activeRaces[trackId]) {
            activeRaces[trackId].countdown = ms;
          }
          return;
        }

        // ================= GRID =================
        if (line.startsWith('grid||')) {
          const html = line.replace(/^grid\|\|/, '');
          const trs = [...html.matchAll(/<tr data-id="(r\d+)"[\s\S]*?<\/tr>/g)];
          trs.forEach((tr) => {
            const teamId = tr[1];
            const row = tr[0];
            const nameMatch = row.match(/data-id="r\d+c4"[^>]*>([^<]*)</);
            const teamName = nameMatch ? nameMatch[1].trim() : null;
            if (teamName)
              raceData[teamId] = { teamName: teamName, segments: [] };
          });
          return;
        }

        // ================= PIT IN / OUT =================
        const pitMatch = line.match(/(r\d+)\|\*(in|out)\|(\d+)/);
        if (pitMatch) {
          const [, teamId, action] = pitMatch;
          if (!raceData[teamId]) raceData[teamId] = { segments: [] };

          if (action === 'in') {
            raceData[teamId].pitStatus = 'in';
          }
          if (action === 'out') {
            raceData[teamId].pitStatus = 'out';
            raceData[teamId].laps = [];
          }
          return;
        }

        // ================= COLUMN UPDATE =================
        const match = line.match(/(r\d+)c(\d+)\|([^|]*)\|(.+)/);
        if (!match) return;

        const [, teamId, cNum, , value] = match;
        if (!raceData[teamId]) raceData[teamId] = { segments: [] };

        if (['2', '7', '8', '11', '13'].includes(cNum)) {
          raceData[teamId][`c${cNum}`] = value;
        }

        // LAP TIME
        if (cNum === '8') {
          const lapTime = parseLapTime(value);
          if (
            lapTime &&
            !raceData[teamId].laps?.includes(lapTime) &&
            raceData[teamId].pitStatus !== 'in'
          ) {
            raceData[teamId].laps = raceData[teamId].laps || [];
            raceData[teamId].laps.push(lapTime);
            raceData[teamId].currentLapStart = Date.now();
          }
        }

        // PIT TIMER
        if (cNum === '12') {
          raceData[teamId].pitTime = value;
        }
      });

      if (raceGateway && trackId && activeRaces[trackId]) {
        raceGateway.broadcastRaceUpdate(trackId, {
          trackName: track.name,
          countdown: activeRaces[trackId].countdown ?? countdown,
          raceData,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    ws.on('error', (err) => console.error('WS error:', err));
    ws.on('close', () => console.log('WS disconnected'));

    activeRaces[trackId] = {
      ws,
      raceData,
      countdown,
      pits,
      trackName: track.name,
    };

    resolve({ track, timestamp: new Date().toISOString() });
  });
}
