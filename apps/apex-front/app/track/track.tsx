import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router';
import RaceTable from '~/components/RaceTable/RaceTable';
import type { Track } from '~/src/model/Track';
import { TrackService } from '~/src/services/trackService';
import { useTrackStore } from '~/src/store/useTrackStore';

type TrackLoaderData = {
  track: Track;
};

const trackService = new TrackService();

export async function loader({ params }: { params: { trackName?: string; }; }): Promise<TrackLoaderData> {
  const trackName = params.trackName;
  if (!trackName) {
    throw new Response('Track name is required', { status: 400 });
  }

  const tracks = await trackService.fetchTracks();
  const track = tracks.find((item) => item.name === trackName);

  if (!track) {
    throw new Response('Track not found', { status: 404 });
  }

  return { track };
}

export default function Track() {
  const { track } = useLoaderData() as TrackLoaderData;
  const tracks = useTrackStore((state) => state.track);
  const setTrack = useTrackStore((state) => state.setTrack);

  useEffect(() => {
    if (tracks.some((item) => item._id === track._id)) return;
    setTrack([...tracks, track]);
  }, [setTrack, track, tracks]);

  return (
    <RaceTable trackId={track._id} />
  );
}
