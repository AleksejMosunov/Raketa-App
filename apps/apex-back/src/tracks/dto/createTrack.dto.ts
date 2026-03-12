import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ description: 'Name of the track' })
  name: string;
  @ApiProperty({ description: 'WebSocket URL of the track' })
  wsUrl: string;
  @ApiProperty({ description: 'HTTP port of the track' })
  httpPort: number;
  @ApiProperty({ description: 'Official timing of the track' })
  officialTiming: string;
  @ApiProperty({ description: 'Image URL of the track' })
  imgUrl: string;
  @ApiProperty({
    description: 'Indicates if WebSocket is opened',
    default: false,
  })
  openedWs: boolean;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
