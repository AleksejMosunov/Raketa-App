import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Track {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  wsUrl: string;

  @Prop({ required: true })
  httpPort: number;

  @Prop({ required: true })
  officialTiming: string;

  @Prop({ required: true })
  imgUrl: string;

  @Prop({ required: true })
  openedWs: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

export type TrackDocument = HydratedDocument<Track>;
