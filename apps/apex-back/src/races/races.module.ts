import { Module } from '@nestjs/common';
import { RacesController } from './races.controller';
import { RacesService } from './races.service';
import { RacesGateway } from './races.gateway';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [TracksModule],
  controllers: [RacesController],
  providers: [RacesService, RacesGateway],
  exports: [RacesService],
})
export class RacesModule {}
