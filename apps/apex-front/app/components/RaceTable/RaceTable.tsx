import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRaceSocket } from '../../../hooks/useRaceSocket';


type RaceTableProps = {
  trackId: string;
};

type RaceTeam = {
  teamName?: string;
  lastLap?: string | number;
  bestAvg?: string | number;
  segBest?: string | number;
  segTime?: string | number;
  gap?: string | number;
  pits?: number;
};

function isRaceTeam(value: unknown): value is RaceTeam {
  if (!value || typeof value !== 'object') return false;
  const team = value as Record<string, unknown>;
  return team.teamName === undefined || typeof team.teamName === 'string';
}

export default function RaceTable({ trackId }: RaceTableProps) {

  const { state, error } = useRaceSocket(trackId);

  if (error) return <div>Socket error: {error}</div>;
  if (!state) return <div>Нет данных</div>;

  const raceEntries = Object.entries(state.raceData ?? {}).filter((entry): entry is [string, RaceTeam] => {
    const [, team] = entry;
    return isRaceTeam(team);
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Pos</TableCell>
            <TableCell>Team Name</TableCell>
            <TableCell align="right">Last Lap</TableCell>
            <TableCell align="right">10 best Avg</TableCell>
            <TableCell align="right">Seg Best</TableCell>
            <TableCell align="right">Seg Time</TableCell>
            <TableCell align="right">Gap</TableCell>
            <TableCell align="right">Pits</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {raceEntries.map(([kartId, team], index) => (
            <TableRow
              key={kartId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{index}</TableCell>
              <TableCell component="th" scope="row">
                {team.teamName || ''}
              </TableCell>
              {/* <TableCell align="right">{team.lastLap}</TableCell>
              <TableCell align="right">{team.bestAvg}</TableCell>
              <TableCell align="right">{team.segBest}</TableCell>
              <TableCell align="right">{team.segTime}</TableCell>
              <TableCell align="right">{team.gap}</TableCell>
              <TableCell align="right">{team.pits}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
