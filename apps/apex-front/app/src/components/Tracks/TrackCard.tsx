import React from 'react';
import { Link } from 'react-router';
import './styles.css';
import { useTrackStore } from '~/src/store/useTrackStore';

type TrackProps = {
  track: {
    _id: string;
    name: string;
    imgUrl: string;
    officialTiming: string;
    openedWs: boolean;
  };
};

export default function TrackCard({ track }: TrackProps) {
  const startRace = useTrackStore((state) => state.startRace);
  const stopRace = useTrackStore((state) => state.stopRace);
  const setTrackOpenedWs = useTrackStore((state) => state.setTrackOpenedWs);
  const setError = useTrackStore((state) => state.setError);

  const handleStartRace = async () => {
    try {
      await startRace(track._id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start race';
      setTrackOpenedWs(track._id, false);
      setError(message);
    }
  };

  const handleStopRace = async () => {
    try {
      await stopRace(track._id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop race';
      setTrackOpenedWs(track._id, false);
      setError(message);
    }
  };

  return (
    <div className="track-card">
      <Link to={`/track/${track.name}`} onClick={handleStartRace} className='track-card-info'>
        <h3>{track.name}</h3>
        <img src={track.imgUrl} alt={track.name} className="track-image" />
      </Link>
      <a href={`${track.officialTiming}`}>Official Timing</a>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
      >
        <p>Race State: {track.openedWs ? "Started" : "Stopped"}</p>
        {track.openedWs &&
          <button
            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}
            onClick={handleStopRace} disabled={!track.openedWs}>
            X
          </button>
        }
      </div>
    </div>
  );
}
