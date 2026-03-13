import { useEffect, useRef, useState } from 'react';
import { useRaceSocket } from '~/hooks/useRaceSocket';
import './styles.css';

type RaceTableProps = {
  trackId: string;
};

type RaceTeam = {
  teamName?: string;
  c2?: string;
  c7?: string;
  c8?: string;
  c11?: string;
  c13?: string;
  pitStatus?: 'in' | 'out';
  pitTime?: string;
  laps?: number[];
};

type TeamSnapshot = {
  c7?: string;
  c8?: string;
  c11?: string;
  c13?: string;
  pitStatus?: 'in' | 'out';
  pitTime?: string;
  lapsCount: number;
};

type PositionTrend = 'up' | 'down' | 'same';

function isRaceTeam(value: unknown): value is RaceTeam {
  if (!value || typeof value !== 'object') return false;
  const team = value as Record<string, unknown>;
  return team.teamName === undefined || typeof team.teamName === 'string';
}

function formatCountdown(ms?: number): string {
  if (!ms || ms < 0) return '--:--';
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toPosition(value?: string, fallback?: number): number {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return fallback ?? Number.MAX_SAFE_INTEGER;
}

function getPitStatusLabel(status?: 'in' | 'out') {
  if (status === 'in') return 'In Pit';
  if (status === 'out') return 'On Track';
  return '-';
}

function classNames(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function buildSnapshot(team: RaceTeam): TeamSnapshot {
  return {
    c7: team.c7,
    c8: team.c8,
    c11: team.c11,
    c13: team.c13,
    pitStatus: team.pitStatus,
    pitTime: team.pitTime,
    lapsCount: team.laps?.length ?? 0,
  };
}

export default function RaceTable({ trackId }: RaceTableProps) {
  const { state, error, connected } = useRaceSocket(trackId);

  const previousPositionsRef = useRef<Record<string, number>>({});
  const previousSnapshotsRef = useRef<Record<string, TeamSnapshot>>({});
  const [positionTrends, setPositionTrends] = useState<Record<string, PositionTrend>>({});
  const [updatedCells, setUpdatedCells] = useState<Record<string, true>>({});

  const raceEntries = Object.entries(state?.raceData ?? {})
    .filter((entry): entry is [string, RaceTeam] => {
      const [, team] = entry;
      return isRaceTeam(team);
    })
    .sort((a, b) => {
      const [, teamA] = a;
      const [, teamB] = b;
      return toPosition(teamA.c2) - toPosition(teamB.c2);
    });

  useEffect(() => {
    if (!state) return;

    const nextPositions: Record<string, number> = {};
    const nextSnapshots: Record<string, TeamSnapshot> = {};
    const nextTrends: Record<string, PositionTrend> = {};
    const changedKeys: string[] = [];

    raceEntries.forEach(([kartId, team], index) => {
      const currentPosition = toPosition(team.c2, index + 1);
      nextPositions[kartId] = currentPosition;

      const previousPosition = previousPositionsRef.current[kartId];
      if (previousPosition !== undefined) {
        if (currentPosition < previousPosition) {
          nextTrends[kartId] = 'up';
        } else if (currentPosition > previousPosition) {
          nextTrends[kartId] = 'down';
        } else {
          nextTrends[kartId] = 'same';
        }
      }

      const snapshot = buildSnapshot(team);
      nextSnapshots[kartId] = snapshot;
      const previousSnapshot = previousSnapshotsRef.current[kartId];

      if (!previousSnapshot) return;

      if (previousSnapshot.c8 !== snapshot.c8) changedKeys.push(`${kartId}:c8`);
      if (previousSnapshot.c7 !== snapshot.c7) changedKeys.push(`${kartId}:c7`);
      if (previousSnapshot.c11 !== snapshot.c11) changedKeys.push(`${kartId}:c11`);
      if (previousSnapshot.pitTime !== snapshot.pitTime) changedKeys.push(`${kartId}:pitTime`);
      if (previousSnapshot.c13 !== snapshot.c13) changedKeys.push(`${kartId}:c13`);
      if (previousSnapshot.pitStatus !== snapshot.pitStatus) changedKeys.push(`${kartId}:pitStatus`);
      if (previousSnapshot.lapsCount !== snapshot.lapsCount) changedKeys.push(`${kartId}:lapsCount`);
    });

    previousPositionsRef.current = nextPositions;
    previousSnapshotsRef.current = nextSnapshots;
    setPositionTrends(nextTrends);

    if (!changedKeys.length) return;

    setUpdatedCells((previous) => {
      const merged = { ...previous };
      changedKeys.forEach((key) => {
        merged[key] = true;
      });
      return merged;
    });

    const timeoutId = window.setTimeout(() => {
      setUpdatedCells((previous) => {
        const next = { ...previous };
        changedKeys.forEach((key) => {
          delete next[key];
        });
        return next;
      });
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [state]);

  const hasUpdated = (kartId: string, field: string): boolean => {
    return Boolean(updatedCells[`${kartId}:${field}`]);
  };

  if (error) return <div className="race-shell">Socket error: {error}</div>;
  if (!state) return <div className="race-shell">Нет данных</div>;

  return (
    <section className="race-shell">
      <div className="race-header">
        <div>
          <p className="race-kicker">Live Timing</p>
          <h2 className="race-title">{state.trackName ?? 'Race'}</h2>
        </div>
        <div className="race-meta">
          <span className={connected ? 'ws-pill online' : 'ws-pill offline'}>
            {connected ? 'WS Online' : 'WS Offline'}
          </span>
          <span className="countdown-pill">Countdown {formatCountdown(state.countdown)}</span>
        </div>
      </div>

      <div className="race-table-wrap">
        <table className="race-table" aria-label="race table">
          <thead>
            <tr>
              <th className="align-right">Pos</th>
              <th>Team Name</th>
              <th className="align-right">Last Lap</th>
              <th className="align-right">10 best Avg</th>
              <th className="align-right">Seg Best</th>
              <th className="align-right">Pit Time</th>
              <th className="align-right">Gap</th>
              <th className="align-right">Pit Status</th>
              <th className="align-right">Laps</th>
            </tr>
          </thead>
          <tbody>
            {raceEntries.map(([kartId, team], index) => {
              const trend = positionTrends[kartId];

              return (
                <tr key={kartId} className={index < 3 ? 'podium-row' : undefined}>
                  <td className={classNames('align-right', 'position-cell', trend === 'up' && 'position-up', trend === 'down' && 'position-down')}>
                    <span className="position-wrap">
                      <span>{team.c2 ?? index + 1}</span>
                      {trend === 'up' && <span className="position-indicator up">▲</span>}
                      {trend === 'down' && <span className="position-indicator down">▼</span>}
                    </span>
                  </td>
                  <th scope="row" className="team-cell">{team.teamName || '-'}</th>
                  <td className={classNames('align-right', hasUpdated(kartId, 'c8') && 'updated-cell')}>{team.c8 ?? '-'}</td>
                  <td className={classNames('align-right', hasUpdated(kartId, 'c7') && 'updated-cell')}>{team.c7 ?? '-'}</td>
                  <td className={classNames('align-right', hasUpdated(kartId, 'c11') && 'updated-cell')}>{team.c11 ?? '-'}</td>
                  <td className={classNames('align-right', hasUpdated(kartId, 'pitTime') && 'updated-cell')}>{team.pitTime ?? '-'}</td>
                  <td className={classNames('align-right', hasUpdated(kartId, 'c13') && 'updated-cell')}>{team.c13 ?? '-'}</td>
                  <td className={classNames('align-right', hasUpdated(kartId, 'pitStatus') && 'updated-cell')}>
                    <span className={team.pitStatus === 'in' ? 'pit-badge in' : 'pit-badge out'}>
                      {getPitStatusLabel(team.pitStatus)}
                    </span>
                  </td>
                  <td className={classNames('align-right', hasUpdated(kartId, 'lapsCount') && 'updated-cell')}>
                    {team.laps?.length ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
