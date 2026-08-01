import { useParams } from 'react-router-dom';
import en from './en.json';
import vi from './vi.json';
import ru from './ru.json';
import jp from './jp.json';
import it from './it.json';
import ko from './ko.json';
import cn from './cn.json';
import es from './es.json';
import { isSupportedLanguage } from './languages';

const dictionaries = { en, vi, ru, jp, it, ko, cn, es };

export function useTranslation() {
  const { lang } = useParams();
  const currentLang = isSupportedLanguage(lang) ? lang : 'en';
  const dict = dictionaries[currentLang] || dictionaries.en;

  /**
   * Lookup key string path, e.g., t('nav.crew')
   */
  const t = (pathKey, fallbackOrParams = '', interpolationParams = {}) => {
    const fallback = typeof fallbackOrParams === 'string' ? fallbackOrParams : '';
    const params = typeof fallbackOrParams === 'object' && fallbackOrParams !== null
      ? fallbackOrParams
      : interpolationParams;
    const interpolate = (text) => text.replace(/\{(\w+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match
    ));
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
            return interpolate(fallback || pathKey);
          }
        }
        return interpolate(typeof fallbackVal === 'string' ? fallbackVal : (fallback || pathKey));
      }
    }
    return interpolate(typeof val === 'string' ? val : (fallback || pathKey));
  };

  return { t, lang: currentLang };
}
