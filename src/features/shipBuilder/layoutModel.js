export const TILE_SIZE = 25;

export function flattenRoomCatalog(groups = []) {
  return groups.flatMap((group) => group.levels || []);
}

export function roomCells(room, design) {
  if (!design) return [];
  const cells = [];
  for (let rowOffset = 0; rowOffset < Number(design.rows || 1); rowOffset += 1) {
    for (let columnOffset = 0; columnOffset < Number(design.columns || 1); columnOffset += 1) {
      cells.push({
        column: Number(room.column) + columnOffset,
        row: Number(room.row) + rowOffset
      });
    }
  }
  return cells;
}

export function roomSupportsGridType(design, gridType) {
  const supportedGridTypes = Number(design?.raw?.SupportedGridTypes ?? 1);
  const type = Number(gridType);
  if (!Number.isInteger(type) || type < 1) return false;
  return (supportedGridTypes & (1 << (type - 1))) !== 0;
}

const purchaseRootId = (purchase) => Number(purchase?.RoomDesignId || purchase?.roomDesignId || 0);

export function isPlayerShipRoomDesign(design, roomPurchases = []) {
  if (!design || (Number(design.raw?.SupportedGridTypes ?? 1) & 1) === 0) return false;
  const name = String(design.name || design.raw?.RoomName || '');
  if (/^Station\b/i.test(name) || /^Doomlaser\b/i.test(name)) return false;
  if (!roomPurchases.length) return true;
  const rootId = Number(design.rootId || design.id);
  const matching = roomPurchases.filter((purchase) => purchaseRootId(purchase) === rootId);
  if (matching.length) return matching.some((purchase) => (Number(purchase.AvailabilityMask ?? 1) & 1) !== 0);
  return Boolean(String(design.raw?.PriceString || '').trim());
}

export function deploymentLimitForDesign(ship, design, roomPurchases = []) {
  if (!isPlayerShipRoomDesign(design, roomPurchases)) return 0;
  const rootId = Number(design.rootId || design.id);
  const shipLevel = Number(ship?.shipLevel || ship?.raw?.ShipLevel || 0);
  const playerRules = roomPurchases.filter((purchase) => (
    purchaseRootId(purchase) === rootId
    && (Number(purchase.AvailabilityMask ?? 1) & 1) !== 0
  ));
  let purchaseLimit = Number.POSITIVE_INFINITY;

  if (playerRules.length) {
    purchaseLimit = playerRules.reduce((total, purchase) => {
      if (Number(purchase.Level || 0) > shipLevel) return total;
      const requirement = String(purchase.RequirementString || '');
      const raceMatch = requirement.match(/originalRaceId\s*==\s*(\d+)/);
      if (raceMatch && Number(raceMatch[1]) !== Number(ship?.raceId || ship?.raw?.RaceId || 0)) return total;
      return total + Number(purchase.Quantity || 0);
    }, 0);
  }

  const maxCount = Number(design.raw?.MaxCount || 0);
  return maxCount > 0 ? Math.min(maxCount, purchaseLimit) : purchaseLimit;
}

export function isRoomOutsideHull(ship, room, design) {
  if (!ship || !design) return true;
  const columns = Number(ship.columns || 0);
  const rows = Number(ship.rows || 0);
  const mask = String(ship.mask || '');

  return roomCells(room, design).some((cell) => {
    if (cell.column < 0 || cell.row < 0 || cell.column >= columns || cell.row >= rows) return true;
    return Boolean(mask) && mask[cell.row * columns + cell.column] === '0';
  });
}

export function validateLayout(ship, rooms, roomById, roomPurchases = []) {
  const issues = new Map();
  const occupied = new Map();
  const columns = Number(ship?.columns || 0);
  const rows = Number(ship?.rows || 0);
  const mask = String(ship?.mask || '');

  const addIssue = (uid, issue) => {
    const existing = issues.get(uid) || [];
    if (!existing.includes(issue)) issues.set(uid, [...existing, issue]);
  };

  rooms.forEach((room) => {
    const design = roomById.get(Number(room.roomDesignId));
    if (!design) {
      addIssue(room.uid, 'Unknown room design');
      return;
    }

    roomCells(room, design).forEach((cell) => {
      const outside = cell.column < 0 || cell.row < 0 || cell.column >= columns || cell.row >= rows;
      if (outside) {
        addIssue(room.uid, 'Outside hull bounds');
        return;
      }

      const gridType = mask[cell.row * columns + cell.column];
      if (mask && gridType === '0') {
        addIssue(room.uid, 'Outside usable hull grid');
      } else if (mask && (gridType === '1' || gridType === '2') && !roomSupportsGridType(design, gridType)) {
        addIssue(room.uid, `Room cannot be placed on Tier ${gridType} grid`);
      }

      const key = `${cell.column},${cell.row}`;
      const otherUid = occupied.get(key);
      if (otherUid && otherUid !== room.uid) {
        addIssue(room.uid, 'Overlaps another room');
        addIssue(otherUid, 'Overlaps another room');
      } else {
        occupied.set(key, room.uid);
      }
    });
  });

  const deployedByRoot = new Map();
  rooms.forEach((room) => {
    const design = roomById.get(Number(room.roomDesignId));
    if (!design) return;
    const rootId = Number(design.rootId || design.id);
    const deployed = (deployedByRoot.get(rootId) || 0) + 1;
    deployedByRoot.set(rootId, deployed);
    const limit = deploymentLimitForDesign(ship, design, roomPurchases);
    if (deployed > limit) addIssue(room.uid, `Exceeds deployment limit (${limit})`);
  });

  return issues;
}

export function findFirstPlacement(ship, rooms, design, roomById, roomPurchases = []) {
  if (!ship || !design) return { column: 0, row: 0 };
  const maxColumn = Number(ship.columns) - Number(design.columns || 1);
  const maxRow = Number(ship.rows) - Number(design.rows || 1);

  for (let row = 0; row <= maxRow; row += 1) {
    for (let column = 0; column <= maxColumn; column += 1) {
      const candidate = { uid: '__candidate__', column, row, roomDesignId: design.id };
      const candidateIssues = validateLayout(ship, [...rooms, candidate], roomById, roomPurchases).get(candidate.uid);
      if (!candidateIssues?.length) return { column, row };
    }
  }
  return { column: 0, row: 0 };
}

export function gridPositionFromPointer(clientX, clientY, boardRect, zoom, design, ship) {
  const unit = TILE_SIZE * Number(zoom || 1);
  const designColumns = Number(design?.columns || 1);
  const designRows = Number(design?.rows || 1);
  const maxColumn = Math.max(0, Number(ship?.columns || designColumns) - designColumns);
  const maxRow = Math.max(0, Number(ship?.rows || designRows) - designRows);
  const centeredColumn = Math.round((clientX - boardRect.left) / unit - designColumns / 2);
  const centeredRow = Math.round((clientY - boardRect.top) / unit - designRows / 2);

  return {
    column: Math.min(maxColumn, Math.max(0, centeredColumn)),
    row: Math.min(maxRow, Math.max(0, centeredRow))
  };
}
