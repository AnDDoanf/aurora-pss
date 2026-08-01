import fs from 'node:fs/promises';

const sourcePath = new URL('../src/i18n/en.json', import.meta.url);
const targets = {
  ru: 'ru',
  jp: 'ja',
  it: 'it',
  ko: 'ko',
  cn: 'zh-CN',
  es: 'es'
};

const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

const collectStrings = (value, path = [], entries = []) => {
  if (typeof value === 'string') {
    entries.push({ path, value });
    return entries;
  }
  Object.entries(value).forEach(([key, child]) => collectStrings(child, [...path, key], entries));
  return entries;
};

const setAtPath = (object, path, value) => {
  let cursor = object;
  path.slice(0, -1).forEach((key) => {
    cursor[key] ??= {};
    cursor = cursor[key];
  });
  cursor[path.at(-1)] = value;
};

const protectTokens = (text) => {
  const tokens = [];
  const protectedText = text.replace(/\{\w+\}|https?:\/\/\S+|Ctrl\+K/gi, (token) => {
    const marker = `__PSS_TOKEN_${tokens.length}__`;
    tokens.push(token);
    return marker;
  });
  return { protectedText, tokens };
};

const restoreTokens = (text, tokens) => tokens.reduce(
  (result, token, index) => result.replaceAll(`__PSS_TOKEN_${index}__`, token),
  text
);

const translateText = async (text, language, attempt = 1) => {
  const params = new URLSearchParams({ client: 'gtx', sl: 'en', tl: language, dt: 't', q: text });
  try {
    const response = await fetch('https://translate.googleapis.com/translate_a/single', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: params
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return payload[0].map((segment) => segment[0]).join('');
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    return translateText(text, language, attempt + 1);
  }
};

const makeBatches = (entries, maxCharacters = 3500) => {
  const batches = [];
  let current = [];
  let size = 0;
  entries.forEach((entry, index) => {
    const protectedValue = protectTokens(entry.value);
    const marked = `__PSS_ENTRY_${String(index).padStart(4, '0')}__ ${protectedValue.protectedText}`;
    if (current.length && size + marked.length + 1 > maxCharacters) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push({ ...entry, index, ...protectedValue, marked });
    size += marked.length + 1;
  });
  if (current.length) batches.push(current);
  return batches;
};

const parseBatch = (translated, batch) => {
  const results = new Map();
  const marker = /__PSS_ENTRY_(\d{4})__\s*/g;
  const matches = [...translated.matchAll(marker)];
  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? translated.length;
    results.set(Number(match[1]), translated.slice(start, end).trim());
  });
  if (results.size !== batch.length) {
    throw new Error(`Expected ${batch.length} entries but received ${results.size}`);
  }
  return results;
};

const entries = collectStrings(source);
const batches = makeBatches(entries);

for (const [fileCode, translationCode] of Object.entries(targets)) {
  const dictionary = {};
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];
    const translated = await translateText(batch.map(({ marked }) => marked).join('\n'), translationCode);
    const results = parseBatch(translated, batch);
    batch.forEach((entry) => {
      setAtPath(dictionary, entry.path, restoreTokens(results.get(entry.index), entry.tokens));
    });
    process.stdout.write(`[i18n] ${fileCode}: ${batchIndex + 1}/${batches.length}\r`);
  }
  const outputPath = new URL(`../src/i18n/${fileCode}.json`, import.meta.url);
  await fs.writeFile(outputPath, `${JSON.stringify(dictionary, null, 2)}\n`, 'utf8');
  process.stdout.write(`[i18n] ${fileCode}: complete (${entries.length} strings)\n`);
}
