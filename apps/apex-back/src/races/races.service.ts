import { Injectable } from '@nestjs/common';
import {
  activeRaces,
  startRace as startRaceSession,
  stopRaceSession,
  setRaceGateway,
} from '../tracks/utills/raceStarter';
import { TracksService } from '../tracks/tracks.service';
import { Track } from '../tracks/schemas/track.schema';
import { RacesGateway } from './races.gateway';

@Injectable()
export class RacesService {
  constructor(private readonly tracksService: TracksService) {}

  getRaceState(trackId: string): Record<string, unknown> | null {
    const race = activeRaces[trackId];
    if (!race) return null;

    return {
      trackName: race.trackName,
      countdown: race.countdown,
      raceData: race.raceData,
      pits: race.pits,
    };
  }
  async startRace(
    trackId: string,
  ): Promise<{ track: Track; timestamp: string } | { error: string }> {
    const track = await this.tracksService.getTrackById(trackId);
    if (!track) return { error: 'Track not found' };

    await this.tracksService.updateTrack(trackId, { openedWs: true });
    return startRaceSession(track);
  }

  async stopRace(trackId: string): Promise<boolean> {
    const stopped = stopRaceSession(trackId);
    if (stopped) {
      await this.tracksService.updateTrack(trackId, { openedWs: false });
    }
    return stopped;
  }

  setGateway(gateway: RacesGateway) {
    setRaceGateway(gateway);
  }
}
