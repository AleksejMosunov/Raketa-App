import { Controller, Get, Param, Post } from '@nestjs/common';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Post(':trackId/start')
  async startRace(@Param('trackId') trackId: string) {
    return this.racesService.startRace(trackId);
  }

  @Get(':trackId/state')
  getRaceState(@Param('trackId') trackId: string) {
    const state = this.racesService.getRaceState(trackId);
    if (!state) {
      return { error: 'Race not found' };
    }
    return state;
  }

  @Post(':trackId/stop')
  async stopRace(@Param('trackId') trackId: string) {
    const stopped = await this.racesService.stopRace(trackId);
    return { stopped };
  }
}
