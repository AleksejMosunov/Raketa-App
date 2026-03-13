import type { Track } from "../model/Track";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

type TrackPayload = Omit<Track, "_id">;

export class TrackService {
  constructor() {}

  public async fetchTracks(): Promise<Track[]> {
    try {
      const response = await fetch(`${API_URL}/tracks`);
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

  public async fetchTrackById(id: string): Promise<Track> {
    try {
      const response = await fetch(`${API_URL}/tracks/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch track with id: ${id}`);
      }
      const data: Track = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching track with id ${id}:`, error);
      throw error;
    }
  }

  public async updateTrack(
    id: string,
    track: Partial<TrackPayload>,
  ): Promise<Track> {
    try {
      const response = await fetch(`${API_URL}/tracks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(track),
      });
      if (!response.ok) {
        throw new Error(`Failed to update track with id: ${id}`);
      }
      const data: Track = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating track with id ${id}:`, error);
      throw error;
    }
  }

  public async deleteTrack(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/tracks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete track with id: ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting track with id ${id}:`, error);
      throw error;
    }
  }

  public async createTrack(track: TrackPayload): Promise<Track> {
    try {
      const response = await fetch(`${API_URL}/tracks`, {
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
