import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/createTrack.dto';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.createTrack(createTrackDto);
  }

  @Get()
  async getAll() {
    return this.tracksService.getAllTracks();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.tracksService.getTrackById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: CreateTrackDto,
  ) {
    return this.tracksService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tracksService.deleteTrack(id);
  }
}
