import { describe, expect, it } from 'vitest';
import {
  buildFleetMembershipHistory,
  buildMonthlyPlayerHistory,
  buildTournamentHistory
} from '../src/features/player/playerHistoryAnalysis';

const history = [
  { timestamp: '2026-01-01T00:00:00Z', fleetName: 'Alpha', trophy: 100, tournamentRunning: false },
  { timestamp: '2026-01-31T23:59:00Z', fleetName: 'Alpha', trophy: 200, tournamentRunning: true },
  { timestamp: '2026-02-05T00:00:00Z', fleetName: 'Beta', trophy: 250, tournamentRunning: false },
  { timestamp: '2026-02-28T23:59:00Z', fleetName: 'Beta', trophy: 300, tournamentRunning: true }
];

describe('player history analysis', () => {
  it('compresses consecutive fleet records into membership periods', () => {
    expect(buildFleetMembershipHistory(history)).toEqual([
      expect.objectContaining({ fleetName: 'Beta', records: 2, firstTrophy: 250, lastTrophy: 300 }),
      expect.objectContaining({ fleetName: 'Alpha', records: 2, firstTrophy: 100, lastTrophy: 200 })
    ]);
  });

  it('keeps the final tournament record for each month', () => {
    expect(buildTournamentHistory(history).map((entry) => entry.month)).toEqual(['2026-02', '2026-01']);
  });

  it('downsamples history to the latest record per month', () => {
    expect(buildMonthlyPlayerHistory(history).map((entry) => entry.trophy)).toEqual([200, 300]);
  });
});
