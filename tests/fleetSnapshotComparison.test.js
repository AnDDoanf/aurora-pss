import { describe, expect, it } from 'vitest';
import { compareFleetMembers } from '../src/features/fleet/fleetSnapshotComparison';
import { buildFleetSnapshotQuery } from '../src/features/fleet/fleetSnapshotSelection';

describe('fleet snapshot member comparison', () => {
  it('counts joins and departures by player ID', () => {
    const result = compareFleetMembers(
      [{ id: 1, name: 'Alpha' }, { id: 2, name: 'Bravo' }],
      [{ id: 2, name: 'Bravo renamed' }, { id: 3, name: 'Charlie' }]
    );

    expect(result.firstCount).toBe(2);
    expect(result.secondCount).toBe(2);
    expect(result.changedCount).toBe(2);
    expect(result.joined.map((member) => member.id)).toEqual([3]);
    expect(result.left.map((member) => member.id)).toEqual([1]);
    expect(result.retained.map((member) => member.id)).toEqual([2]);
  });

  it('handles an empty snapshot', () => {
    const result = compareFleetMembers([], [{ id: 7, name: 'New member' }]);
    expect(result.changedCount).toBe(1);
    expect(result.joined).toHaveLength(1);
    expect(result.left).toHaveLength(0);
  });
});

describe('fleet snapshot selection', () => {
  const now = new Date('2026-08-01T14:30:00.000Z');

  it('targets a specific UTC hour when date and hour are supplied', () => {
    expect(buildFleetSnapshotQuery('2026-07-30', '10', now)).toMatchObject({
      fromDate: '2026-07-30T10:00:00.000Z',
      toDate: '2026-07-30T10:59:59.999Z',
      desc: false,
      take: 1
    });
  });

  it('selects the first post-reset snapshot for a historical date', () => {
    expect(buildFleetSnapshotQuery('2026-07-30', '', now)).toMatchObject({
      fromDate: '2026-07-30T00:00:00.000Z',
      toDate: '2026-07-30T23:59:59.999Z',
      desc: false
    });
  });

  it('selects the latest snapshot for today and defaults an hour-only input to today', () => {
    expect(buildFleetSnapshotQuery('2026-08-01', '', now)).toMatchObject({
      toDate: now.toISOString(),
      desc: true
    });
    expect(buildFleetSnapshotQuery('', '09', now).fromDate).toBe('2026-08-01T09:00:00.000Z');
  });

  it('leaves completely empty selection to the latest-two fallback', () => {
    expect(buildFleetSnapshotQuery('', '', now)).toBeNull();
  });
});
