import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model } from 'mongoose';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  async getAllTracks(): Promise<TrackDocument[]> {
    return this.trackModel.find().exec();
  }

  async getTrackById(id: string): Promise<TrackDocument | null> {
    return this.trackModel.findById(id).exec();
  }

  async createTrack(trackData: Partial<Track>): Promise<TrackDocument> {
    const createdTrack = new this.trackModel(trackData);
    return createdTrack.save();
  }

  async updateTrack(
    id: string,
    trackData: Partial<Track>,
  ): Promise<TrackDocument | null> {
    return this.trackModel
      .findByIdAndUpdate(id, trackData, { new: true })
      .exec();
  }

  async deleteTrack(id: string): Promise<TrackDocument | null> {
    return this.trackModel.findByIdAndDelete(id).exec();
  }
}
