// src/hooks/useFetchTracks.ts
import { useEffect } from "react";
import { TrackService } from "~/src/services/trackService";
import { useTrackStore } from "~/src/store/useTrackStore";

export const useFetchTracks = () => {
  const setTrack = useTrackStore((state) => state.setTrack);
  const setLoading = useTrackStore((state) => state.setLoading);
  const setError = useTrackStore((state) => state.setError);
  const setAllTracksOpenedWs = useTrackStore(
    (state) => state.setAllTracksOpenedWs,
  );

  const trackService = new TrackService();

  useEffect(() => {
    const fetchTracks = async (showLoading: boolean) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const tracks = await trackService.fetchTracks();
        setTrack(tracks);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch tracks";
        setError(message);
        // Backend unavailable: keep UI consistent with disconnected race state.
        setAllTracksOpenedWs(false);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    void fetchTracks(true);

    const intervalId = window.setInterval(() => {
      void fetchTracks(false);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [setTrack, setLoading, setError, setAllTracksOpenedWs]);
};
