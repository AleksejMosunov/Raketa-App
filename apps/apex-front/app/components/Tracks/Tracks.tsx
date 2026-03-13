import { useFetchTracks } from '~/hooks/useFetchTracks';
import { useTrackStore } from '~/src/store/useTrackStore';
import TrackCard from './TrackCard';

export default function Tracks() {

  const tracks = useTrackStore((state) => state.track);
  const isLoading = useTrackStore((state) => state.isLoading);
  const error = useTrackStore((state) => state.error);

  useFetchTracks(); // подгружаем данные при монтировании

  if (isLoading) return <p className="tracks-state">Loading tracks...</p>;
  if (error) return <p className="tracks-state error">Error: {error}</p>;
  return (
    <section className="tracks-section">
      <div className="tracks-head">
        <p className="tracks-kicker">Tracks</p>
        <h1>Choose Race Arena</h1>
      </div>
      <div className="track-list">
        {tracks.map((track) => (
          <TrackCard key={track.name} track={track} />
        ))}
      </div>
    </section>
  );
}
