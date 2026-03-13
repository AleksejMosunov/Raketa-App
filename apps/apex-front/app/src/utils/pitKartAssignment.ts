export type TeamWithData<TData = Record<string, unknown>> = {
  teamId: string | number;
  data: TData;
};

export type OpenRowResult<TData = Record<string, unknown>> = {
  openRow: number;
  previousTeamIdInRow: string | number | null;
  previousTeamDataInRow: TData | null;
};

/**
 * Returns which row is open now and who entered that row previously.
 *
 * Example with 4 rows and history [1,2,3,4,5,1,4,5]:
 * - openRow = 1
 * - previousTeamIdInRow = 5
 */
export function getOpenRowAndPreviousTeam<TData = Record<string, unknown>>(
  teams: TeamWithData<TData>[],
  pitHistory: Array<string | number>,
  rowCount = 4,
): OpenRowResult<TData> {
  if (rowCount <= 0) {
    throw new Error('rowCount must be greater than 0');
  }

  const teamMap = new Map<string | number, TData>();
  for (const team of teams) {
    teamMap.set(team.teamId, team.data);
  }

  // Rows are filled in round-robin order: 1..rowCount, then repeat.
  const openRow = (pitHistory.length % rowCount) + 1;

  // Find the latest history entry that belongs to this row.
  let previousTeamIdInRow: string | number | null = null;
  for (let i = pitHistory.length - 1; i >= 0; i -= 1) {
    const rowForEntry = (i % rowCount) + 1;
    if (rowForEntry === openRow) {
      previousTeamIdInRow = pitHistory[i];
      break;
    }
  }

  const previousTeamDataInRow =
    previousTeamIdInRow === null ? null : (teamMap.get(previousTeamIdInRow) ?? null);

  return {
    openRow,
    previousTeamIdInRow,
    previousTeamDataInRow,
  };
}
