const DEFAULT_PIXEL_PRESTIGE_ORIGIN = 'https://pixel-prestige.com/ship-builder.php';

const parsePositiveInteger = (value, label) => {
  const text = String(value ?? '').trim();
  if (!/^\d+$/.test(text)) {
    throw new Error(`${label} must be a positive integer.`);
  }
  const parsed = Number(text);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return parsed;
};

const parseCoordinate = (value, label) => {
  const text = String(value ?? '').trim();
  if (!/^-?\d+$/.test(text)) {
    throw new Error(`${label} must be an integer.`);
  }
  const parsed = Number(text);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${label} must be an integer.`);
  }
  return parsed;
};

const extractSearchParams = (input) => {
  const value = String(input ?? '').trim();
  if (!value) throw new Error('Paste a Pixel Prestige builder URL first.');

  try {
    return new URL(value).searchParams;
  } catch {
    const query = value.startsWith('?') ? value.slice(1) : value;
    if (!query.includes('=') && !query.includes('&')) {
      throw new Error('The builder URL is not valid.');
    }
    return new URLSearchParams(query);
  }
};

export function parseShipBuilderInput(input) {
  const params = extractSearchParams(input);
  const shipId = parsePositiveInteger(params.get('ship'), 'Ship design ID');
  const roomsValue = String(params.get('rooms') ?? '').trim();

  const rooms = roomsValue
    ? roomsValue.split('-').map((segment, index) => {
        const parts = segment.split(',');
        if (parts.length !== 3) {
          throw new Error(`Room ${index + 1} must use column,row,roomDesignId.`);
        }
        return {
          uid: `imported-${index + 1}`,
          column: parseCoordinate(parts[0], `Room ${index + 1} column`),
          row: parseCoordinate(parts[1], `Room ${index + 1} row`),
          roomDesignId: parsePositiveInteger(parts[2], `Room ${index + 1} design ID`)
        };
      })
    : [];

  if (rooms.length > 1000) {
    throw new Error('A layout cannot contain more than 1,000 room entries.');
  }

  return { shipId, rooms };
}

export function serializeRooms(rooms = []) {
  return rooms
    .map((room) => `${Number(room.column)},${Number(room.row)},${Number(room.roomDesignId)}`)
    .join('-');
}

export function buildPixelPrestigeUrl(shipId, rooms = []) {
  const url = new URL(DEFAULT_PIXEL_PRESTIGE_ORIGIN);
  url.searchParams.set('ship', String(parsePositiveInteger(shipId, 'Ship design ID')));
  url.searchParams.set('rooms', serializeRooms(rooms));
  return url.toString();
}

export function buildBuilderSearch(shipId, rooms = []) {
  const params = new URLSearchParams();
  params.set('ship', String(parsePositiveInteger(shipId, 'Ship design ID')));
  params.set('rooms', serializeRooms(rooms));
  return params.toString();
}
