import { describe, expect, it } from 'vitest';
import en from '../src/i18n/en.json';
import vi from '../src/i18n/vi.json';
import ru from '../src/i18n/ru.json';
import jp from '../src/i18n/jp.json';
import italian from '../src/i18n/it.json';
import ko from '../src/i18n/ko.json';
import cn from '../src/i18n/cn.json';
import es from '../src/i18n/es.json';

const dictionaries = { en, vi, ru, jp, it: italian, ko, cn, es };

describe('prestige optimizer translations', () => {
  it('defines every prestige page key in every supported language', () => {
    const expectedKeys = Object.keys(en.pages.prestige).sort();

    for (const [language, dictionary] of Object.entries(dictionaries)) {
      expect(dictionary.layout.prestige, `${language} navigation label`).toBeTruthy();
      expect(dictionary.layout.prestigeDesc, `${language} navigation description`).toBeTruthy();
      expect(Object.keys(dictionary.pages.prestige).sort(), `${language} page keys`).toEqual(expectedKeys);
      for (const key of expectedKeys) {
        expect(dictionary.pages.prestige[key], `${language}.${key}`).toBeTruthy();
      }
    }
  });
});
