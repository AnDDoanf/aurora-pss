import { describe, expect, it } from 'vitest';
import {
  deploymentLimitForDesign,
  gridPositionFromPointer,
  hasConflictingSuperWeapon,
  isSuperWeaponDesign,
  isPlayerShipRoomDesign,
  isRoomOutsideHull,
  roomSupportsGridType,
  validateLayout
} from '../src/features/shipBuilder/layoutModel';

const ship = {
  columns: 4,
  rows: 3,
  mask: '111111111111'
};
const roomById = new Map([
  [1, { id: 1, columns: 2, rows: 1 }],
  [2, { id: 2, columns: 1, rows: 1 }],
  [3, { id: 3, columns: 1, rows: 1, raw: { SupportedGridTypes: 1 } }],
  [4, { id: 4, columns: 1, rows: 1, raw: { SupportedGridTypes: 3 } }]
]);

describe('ship builder layout validation', () => {
  it('accepts rooms that fit without overlap', () => {
    const rooms = [
      { uid: 'a', roomDesignId: 1, column: 0, row: 0 },
      { uid: 'b', roomDesignId: 2, column: 2, row: 0 }
    ];
    expect(validateLayout(ship, rooms, roomById).size).toBe(0);
  });

  it('marks both overlapping rooms', () => {
    const rooms = [
      { uid: 'a', roomDesignId: 1, column: 0, row: 0 },
      { uid: 'b', roomDesignId: 2, column: 1, row: 0 }
    ];
    const issues = validateLayout(ship, rooms, roomById);
    expect(issues.get('a')).toContain('Overlaps another room');
    expect(issues.get('b')).toContain('Overlaps another room');
  });

  it('detects rooms outside the hull', () => {
    const issues = validateLayout(ship, [
      { uid: 'a', roomDesignId: 1, column: 3, row: 0 }
    ], roomById);
    expect(issues.get('a')).toContain('Outside hull bounds');
  });

  it('identifies rooms released outside the hull bounds or usable mask', () => {
    const maskedShip = { columns: 3, rows: 2, mask: '111101' };
    const design = { id: 2, columns: 1, rows: 1 };

    expect(isRoomOutsideHull(maskedShip, { column: -1, row: 0 }, design)).toBe(true);
    expect(isRoomOutsideHull(maskedShip, { column: 1, row: 1 }, design)).toBe(true);
    expect(isRoomOutsideHull(maskedShip, { column: 2, row: 1 }, design)).toBe(false);
  });

  it('keeps Tier 1 rooms on Tier 1 hull cells', () => {
    const tieredShip = { columns: 2, rows: 1, mask: '12' };
    const valid = validateLayout(tieredShip, [
      { uid: 'a', roomDesignId: 3, column: 0, row: 0 }
    ], roomById);
    const invalid = validateLayout(tieredShip, [
      { uid: 'a', roomDesignId: 3, column: 1, row: 0 }
    ], roomById);

    expect(valid.size).toBe(0);
    expect(invalid.get('a')).toContain('Room cannot be placed on Tier 2 grid');
  });

  it('allows Tier 2 rooms on both Tier 1 and Tier 2 hull cells', () => {
    expect(roomSupportsGridType(roomById.get(4), 1)).toBe(true);
    expect(roomSupportsGridType(roomById.get(4), 2)).toBe(true);

    const tieredShip = { columns: 2, rows: 1, mask: '12' };
    expect(validateLayout(tieredShip, [
      { uid: 'a', roomDesignId: 4, column: 0, row: 0 },
      { uid: 'b', roomDesignId: 4, column: 1, row: 0 }
    ], roomById).size).toBe(0);
  });

  it('uses cumulative room purchases and MaxCount as deployment caps', () => {
    const design = { id: 10, rootId: 10, columns: 1, rows: 1, raw: { SupportedGridTypes: 1, MaxCount: 0 } };
    const purchases = [
      { RoomDesignId: 10, Level: 1, Quantity: 1, AvailabilityMask: 1 },
      { RoomDesignId: 10, Level: 3, Quantity: 1, AvailabilityMask: 1 }
    ];

    expect(deploymentLimitForDesign({ shipLevel: 2 }, design, purchases)).toBe(1);
    expect(deploymentLimitForDesign({ shipLevel: 3 }, design, purchases)).toBe(2);
    expect(deploymentLimitForDesign(
      { shipLevel: 3 },
      { ...design, raw: { ...design.raw, MaxCount: 1 } },
      purchases
    )).toBe(1);
  });

  it('unlocks faction super weapons for non-Pirate, non-Federation, and non-Qtarian ships', () => {
    const federationSuperlaser = { id: 517, rootId: 517, raw: { SupportedGridTypes: 1 } };
    const pirateRocket = { id: 518, rootId: 518, raw: { SupportedGridTypes: 1 } };
    const purchases = [
      { RoomDesignId: 517, Level: 1, Quantity: 1, AvailabilityMask: 1, RequirementString: 'originalRaceId == 2' },
      { RoomDesignId: 518, Level: 1, Quantity: 1, AvailabilityMask: 1, RequirementString: 'originalRaceId == 1' }
    ];

    expect(deploymentLimitForDesign({ shipLevel: 20, raceId: 4 }, federationSuperlaser, purchases)).toBe(1);
    expect(deploymentLimitForDesign({ shipLevel: 20, raceId: 4 }, pirateRocket, purchases)).toBe(1);
    expect(deploymentLimitForDesign({ shipLevel: 20, raceId: 1 }, federationSuperlaser, purchases)).toBe(0);
    expect(deploymentLimitForDesign({ shipLevel: 20, raceId: 1 }, pirateRocket, purchases)).toBe(1);
  });

  it('allows upgrades of one super-weapon type but rejects a different type', () => {
    const superlaser1 = { id: 1001, rootId: 517, columns: 1, rows: 1, raw: { SupportedGridTypes: 1 } };
    const superlaser2 = { id: 1002, rootId: 517, columns: 1, rows: 1, raw: { SupportedGridTypes: 1 } };
    const pirateRocket = { id: 1003, rootId: 518, columns: 1, rows: 1, raw: { SupportedGridTypes: 1 } };
    const designs = new Map([[1001, superlaser1], [1002, superlaser2], [1003, pirateRocket]]);
    const purchases = [
      { RoomDesignId: 517, Level: 1, Quantity: 2, AvailabilityMask: 1, RequirementString: 'originalRaceId == 2' },
      { RoomDesignId: 518, Level: 1, Quantity: 2, AvailabilityMask: 1, RequirementString: 'originalRaceId == 1' }
    ];
    const existing = [{ uid: 'a', roomDesignId: 1001, column: 0, row: 0 }];

    expect(hasConflictingSuperWeapon(existing, superlaser2, designs)).toBe(false);
    expect(hasConflictingSuperWeapon(existing, pirateRocket, designs)).toBe(true);

    const issues = validateLayout(
      { columns: 4, rows: 1, mask: '1111', shipLevel: 20, raceId: 4 },
      [...existing, { uid: 'b', roomDesignId: 1003, column: 2, row: 0 }],
      designs,
      purchases
    );
    expect(issues.get('b')).toContain('Cannot mix super weapon room types');
    expect(issues.has('a')).toBe(false);
  });

  it('includes the Gamma Beam Emitter in super-weapon exclusivity', () => {
    expect(isSuperWeaponDesign({ id: 853, rootId: 853 })).toBe(true);
  });

  it('marks only rooms beyond the deployment cap as invalid', () => {
    const cappedDesign = { id: 10, rootId: 10, columns: 1, rows: 1, raw: { SupportedGridTypes: 1 } };
    const cappedRooms = new Map([[10, cappedDesign]]);
    const purchases = [{ RoomDesignId: 10, Level: 1, Quantity: 1, AvailabilityMask: 1 }];
    const issues = validateLayout(
      { columns: 4, rows: 1, mask: '1111', shipLevel: 1 },
      [
        { uid: 'a', roomDesignId: 10, column: 0, row: 0 },
        { uid: 'b', roomDesignId: 10, column: 2, row: 0 }
      ],
      cappedRooms,
      purchases
    );

    expect(issues.has('a')).toBe(false);
    expect(issues.get('b')).toContain('Exceeds deployment limit (1)');
  });

  it('excludes starbase-only room purchase families', () => {
    const design = { id: 20, rootId: 20, raw: { SupportedGridTypes: 1 } };
    expect(isPlayerShipRoomDesign(design, [
      { RoomDesignId: 20, Level: 1, Quantity: 1, AvailabilityMask: 2 }
    ])).toBe(false);
  });

  it('excludes special Doomlaser and Station room variants from normal ships', () => {
    expect(isPlayerShipRoomDesign({
      id: 793,
      name: 'Doomlaser Lv1',
      raw: { SupportedGridTypes: 1 }
    })).toBe(false);
    expect(isPlayerShipRoomDesign({
      id: 839,
      name: 'Station Turbo Laser Lv1',
      raw: { SupportedGridTypes: 1 }
    })).toBe(false);
  });

  it('excludes unpriced internal rooms without player purchase rules', () => {
    const unrelatedPurchases = [
      { RoomDesignId: 1, Level: 1, Quantity: 1, AvailabilityMask: 1 }
    ];
    expect(isPlayerShipRoomDesign({
      id: 999,
      name: 'Internal Room Lv1',
      raw: { SupportedGridTypes: 1, PriceString: '' }
    }, unrelatedPurchases)).toBe(false);
    expect(isPlayerShipRoomDesign({
      id: 998,
      name: 'Premium Player Room Lv1',
      raw: { SupportedGridTypes: 1, PriceString: 'starbux:1000' }
    }, unrelatedPurchases)).toBe(true);
  });

  it('centers a dropped room on the pointer and snaps to the grid', () => {
    expect(gridPositionFromPointer(
      75,
      50,
      { left: 0, top: 0 },
      1,
      { columns: 2, rows: 1 },
      { columns: 10, rows: 10 }
    )).toEqual({ column: 2, row: 2 });
  });

  it('keeps dropped rooms inside the rectangular hull bounds', () => {
    expect(gridPositionFromPointer(
      999,
      999,
      { left: 0, top: 0 },
      1,
      { columns: 2, rows: 2 },
      { columns: 4, rows: 3 }
    )).toEqual({ column: 2, row: 1 });
  });
});
