import { create } from 'zustand';
import type { Track } from '../model/Track';
import { RaceService } from '../services/raceService';

interface TrackState {
  track: Track[];
  isLoading: boolean;
  error: string | null;
  setTrack: (track: Track[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTrackOpenedWs: (trackId: string, openedWs: boolean) => void;
  setAllTracksOpenedWs: (openedWs: boolean) => void;
  startRace: (trackId: string) => Promise<void>;
  stopRace: (trackId: string) => Promise<void>;
}

const raceService = new RaceService();

export const useTrackStore = create<TrackState>((set) => ({
  track: [],
  isLoading: false,
  error: null,
  setTrack: (track) => set({ track, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setTrackOpenedWs: (trackId, openedWs) =>
    set((state) => ({
      track: state.track.map((item) =>
        item._id === trackId ? { ...item, openedWs } : item,
      ),
    })),
  setAllTracksOpenedWs: (openedWs) =>
    set((state) => ({
      track: state.track.map((item) => ({ ...item, openedWs })),
    })),
  startRace: async (trackId: string) => {
    await raceService.startRace(trackId);
    set((state) => ({
      track: state.track.map((item) =>
        item._id === trackId ? { ...item, openedWs: true } : item,
      ),
      error: null,
    }));
  },
  stopRace: async (trackId: string) => {
    await raceService.stopRace(trackId);
    set((state) => ({
      track: state.track.map((item) =>
        item._id === trackId ? { ...item, openedWs: false } : item,
      ),
      error: null,
    }));
  },
}));
