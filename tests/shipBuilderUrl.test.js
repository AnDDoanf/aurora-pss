import { describe, expect, it } from 'vitest';
import {
  buildBuilderSearch,
  buildPixelPrestigeUrl,
  parseShipBuilderInput,
  serializeRooms
} from '../src/features/shipBuilder/shipBuilderUrl';

describe('ship builder URL helpers', () => {
  const source = 'http://pixel-prestige.com/ship-builder.php?ship=386&rooms=24,20,887-20,20,916-35,10,916';

  it('parses a Pixel Prestige layout URL', () => {
    expect(parseShipBuilderInput(source)).toEqual({
      shipId: 386,
      rooms: [
        { uid: 'imported-1', column: 24, row: 20, roomDesignId: 887 },
        { uid: 'imported-2', column: 20, row: 20, roomDesignId: 916 },
        { uid: 'imported-3', column: 35, row: 10, roomDesignId: 916 }
      ]
    });
  });

  it('accepts a bare query string', () => {
    expect(parseShipBuilderInput('ship=386&rooms=1,2,887').shipId).toBe(386);
  });

  it('serializes rooms in Pixel Prestige order', () => {
    expect(serializeRooms([{ column: 4, row: 5, roomDesignId: 6 }])).toBe('4,5,6');
    expect(buildBuilderSearch(386, [])).toBe('ship=386&rooms=');
    expect(buildPixelPrestigeUrl(386, [])).toContain('ship=386');
  });

  it('rejects malformed rooms', () => {
    expect(() => parseShipBuilderInput('ship=386&rooms=1,2')).toThrow(/column,row,roomDesignId/);
    expect(() => parseShipBuilderInput('ship=nope&rooms=')).toThrow(/Ship design ID/);
  });
});
