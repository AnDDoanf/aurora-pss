import { describe, it, expect } from 'vitest';
import { validateEndpointPayload } from '../scripts/ingestion/validator.mjs';
import { computeHash } from '../scripts/ingestion/fetcher.mjs';

describe('Data Ingestion Pipeline Unit Tests', () => {
  it('computes consistent MD5 hashes', () => {
    const hash = computeHash('<CharacterService></CharacterService>');
    expect(hash).toBeTypeOf('string');
    expect(hash.length).toBe(32);
  });

  it('validates XML payloads correctly', () => {
    const validXml = `
      <CharacterService>
        <CharacterDesigns>
          <CharacterDesign CharacterDesignId="1" CharacterDesignName="Pirate" Rarity="Common" />
        </CharacterDesigns>
      </CharacterService>
    `;

    const result = validateEndpointPayload('CharacterService/ListAllCharacterDesigns2', validXml);
    expect(result.valid).toBe(true);
    expect(result.recordCount).toBe(1);
  });

  it('detects API error envelopes', () => {
    const errorXml = `<Error><Message>Access Denied</Message></Error>`;
    const result = validateEndpointPayload('CharacterService/ListAllCharacterDesigns2', errorXml);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('API error envelope');
  });
});
