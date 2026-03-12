import React from 'react';
import { useParams } from 'react-router';
import { useRaceSocket } from '~/hooks/useRaceSocket';
import RaceTable from '~/src/components/RaceTable/RaceTable';
import { useTrackStore } from '~/src/store/useTrackStore';


export default function Track() {
  const { trackName } = useParams<{ trackName: string; }>();
  const tracks = useTrackStore((state) => state.track);
  const track = tracks.find(t => t.name === trackName);
  const trackId = track?._id || '';
  const { connected, state, error } = useRaceSocket(trackId);

  if (error) return <div>Socket error: {error}</div>;
  if (!state) return <div>Нет данных</div>;

  return (
    <RaceTable trackId={trackId} />
  );
}
