export const LANGUAGES = [
  { code: 'en', label: 'English', hreflang: 'en' },
  { code: 'vi', label: 'Tiếng Việt', hreflang: 'vi' },
  { code: 'ru', label: 'Русский', hreflang: 'ru' },
  { code: 'jp', label: '日本語', hreflang: 'ja' },
  { code: 'it', label: 'Italiano', hreflang: 'it' },
  { code: 'ko', label: '한국어', hreflang: 'ko' },
  { code: 'cn', label: '简体中文', hreflang: 'zh-CN' },
  { code: 'es', label: 'Español', hreflang: 'es' }
];

export const LANGUAGE_CODES = LANGUAGES.map(({ code }) => code);
export const isSupportedLanguage = (code) => LANGUAGE_CODES.includes(code);
export const replaceLanguageInPath = (pathname, language) => {
  const prefixPattern = new RegExp(`^/(${LANGUAGE_CODES.join('|')})(?=/|$)`);
  return prefixPattern.test(pathname)
    ? pathname.replace(prefixPattern, `/${language}`)
    : `/${language}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
};
