import type { Track } from "../model/Track";

export class TrackService {
  constructor() {}

  public async fetchTracks(): Promise<Track[]> {
    try {
      const response = await fetch("http://localhost:3000/tracks");
      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }
      const data: Track[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tracks:", error);
      throw error;
    }
  }

  public async fetchTrackByName(name: string): Promise<Track> {
    try {
      const response = await fetch(`/api/tracks/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch track with name: ${name}`);
      }
      const data: Track = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching track with name ${name}:`, error);
      throw error;
    }
  }

  public async updateTrack(track: Track): Promise<Track> {
    try {
      const response = await fetch(`/api/tracks/${track.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(track),
      });
      if (!response.ok) {
        throw new Error(`Failed to update track with name: ${track.name}`);
      }
      const data: Track = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating track with name ${track.name}:`, error);
      throw error;
    }
  }

  public async deleteTrack(name: string): Promise<void> {
    try {
      const response = await fetch(`/api/tracks/${name}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete track with name: ${name}`);
      }
    } catch (error) {
      console.error(`Error deleting track with name ${name}:`, error);
      throw error;
    }
  }

  public async createTrack(track: Track): Promise<Track> {
    try {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(track),
      });
      if (!response.ok) {
        throw new Error("Failed to create track");
      }
      const data: Track = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating track:", error);
      throw error;
    }
  }
}
