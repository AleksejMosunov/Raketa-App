import { useFetchTracks } from '~/hooks/useFetchTracks';
import { useTrackStore } from '~/src/store/useTrackStore';
import TrackCard from './TrackCard';

export default function Tracks() {

  const tracks = useTrackStore((state) => state.track);
  const isLoading = useTrackStore((state) => state.isLoading);
  const error = useTrackStore((state) => state.error);

  useFetchTracks(); // подгружаем данные при монтировании

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <TrackCard key={track.name} track={track} />
      ))}
    </div>
  );
}
