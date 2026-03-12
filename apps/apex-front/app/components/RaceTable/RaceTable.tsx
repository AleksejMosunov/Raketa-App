import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRaceSocket } from '~/hooks/useRaceSocket';

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

export default function RaceTable({ trackId }: RaceTableProps) {
  const { state, error, connected } = useRaceSocket(trackId);

  if (error) return <div>Socket error: {error}</div>;
  if (!state) return <div>Нет данных</div>;

  const raceEntries = Object.entries(state.raceData ?? {})
    .filter((entry): entry is [string, RaceTeam] => {
      const [, team] = entry;
      return isRaceTeam(team);
    })
    .sort((a, b) => {
      const [_, teamA] = a;
      const [__, teamB] = b;
      return toPosition(teamA.c2) - toPosition(teamB.c2);
    });

  return (
    <TableContainer component={Paper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px' }}>
        <strong>{state.trackName ?? 'Race'}</strong>
        <span>
          {connected ? 'WS: connected' : 'WS: disconnected'} | Countdown: {formatCountdown(state.countdown)}
        </span>
      </div>
      <Table sx={{ minWidth: 650 }} aria-label="race table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Pos</TableCell>
            <TableCell>Team Name</TableCell>
            <TableCell align="right">Last Lap</TableCell>
            <TableCell align="right">10 best Avg</TableCell>
            <TableCell align="right">Seg Best</TableCell>
            <TableCell align="right">Pit Time</TableCell>
            <TableCell align="right">Gap</TableCell>
            <TableCell align="right">Pit Status</TableCell>
            <TableCell align="right">Laps</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {raceEntries.map(([kartId, team], index) => (
            <TableRow
              key={kartId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{team.c2 ?? index + 1}</TableCell>
              <TableCell component="th" scope="row">
                {team.teamName || ''}
              </TableCell>
              <TableCell align="right">{team.c8 ?? '-'}</TableCell>
              <TableCell align="right">{team.c7 ?? '-'}</TableCell>
              <TableCell align="right">{team.c11 ?? '-'}</TableCell>
              <TableCell align="right">{team.pitTime ?? '-'}</TableCell>
              <TableCell align="right">{team.c13 ?? '-'}</TableCell>
              <TableCell align="right">{team.pitStatus ?? '-'}</TableCell>
              <TableCell align="right">{team.laps?.length ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
