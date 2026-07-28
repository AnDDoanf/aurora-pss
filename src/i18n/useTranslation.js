import { useParams } from 'react-router-dom';
import en from './en.json';
import vi from './vi.json';

const dictionaries = { en, vi };

export function useTranslation() {
  const { lang } = useParams();
  const currentLang = (lang === 'en' || lang === 'vi') ? lang : 'vi';
  const dict = dictionaries[currentLang] || dictionaries.vi;

  /**
   * Lookup key string path, e.g., t('nav.crew')
   */
  const t = (pathKey, fallback = '') => {
    const keys = pathKey.split('.');
    let val = dict;
    for (const key of keys) {
      if (val && typeof val === 'object' && key in val) {
        val = val[key];
      } else {
        // Fallback to English dictionary if key missing in target language
        let fallbackVal = dictionaries.en;
        for (const fk of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fk in fallbackVal) {
            fallbackVal = fallbackVal[fk];
          } else {
            return fallback || pathKey;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : (fallback || pathKey);
      }
    }
    return typeof val === 'string' ? val : (fallback || pathKey);
  };

  return { t, lang: currentLang };
}
