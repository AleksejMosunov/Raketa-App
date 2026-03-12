import React from 'react';
import { useParams } from 'react-router';
import RaceTable from '~/components/RaceTable/RaceTable';
import { useTrackStore } from '~/src/store/useTrackStore';


export default function Track() {
  const { trackName } = useParams<{ trackName: string; }>();
  const tracks = useTrackStore((state) => state.track);
  const track = tracks.find(t => t.name === trackName);
  const trackId = track?._id || '';
  if (!trackId) return <div>Track not found</div>;

  return (
    <RaceTable trackId={trackId} />
  );
}
