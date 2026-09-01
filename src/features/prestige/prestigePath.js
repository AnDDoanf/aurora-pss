import solver from 'javascript-lp-solver';

const BLOCK_END_TAGS = /<\/(?:div|p|pre|li|tr|h[1-6])\s*>/gi;
const BREAK_TAGS = /<br\s*\/?\s*>/gi;
const TAGS = /<[^>]+>/g;

const decodeHtml = (value) => String(value || '')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

function annotateMissingCrew(html) {
  return String(html || '').replace(
    /<(span|font)([^>]*(?:color\s*:\s*(?:red|#(?:f00|ff0000)|rgb\s*\(\s*255\s*,\s*0\s*,\s*0\s*\))|color\s*=\s*["']?(?:red|#(?:f00|ff0000))|class\s*=\s*["'][^"']*(?:unowned|missing|text-danger|text-red)[^"']*))[^>]*>([\s\S]*?)<\/\1>/gi,
    ' [[MISSING]]$3[[/MISSING]] '
  );
}

export function prestigeHtmlToText(rawHtml) {
  return decodeHtml(
    annotateMissingCrew(rawHtml)
      .replace(BREAK_TAGS, '\n')
      .replace(BLOCK_END_TAGS, '\n')
      .replace(TAGS, '')
  )
    .replace(/\r/g, '')
    .replace(/[\t\f\v]+/g, '    ')
    .replace(/[ \u00a0]+$/gm, '')
    .replace(/^\s+\n/gm, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractPrestigeError(rawHtml) {
  const text = prestigeHtmlToText(rawHtml);
  const error = text.split('\n').map((line) => line.trim()).find((line) => /^error\s*:/i.test(line));
  return error ? error.replace(/^error\s*:\s*/i, '') : '';
}

export function preprocessPrestigeText(value) {
  const text = String(value || '').trim();
  const pathMatch = /(?:^|\n)\s*path\s*1\s*:/i.exec(text);
  if (!pathMatch) return text;

  const prestigeData = text
    .split('\n')
    .map((line) => line.trim())
    .find((line) => /^prestige data from\s*:/i.test(line));
  const pathStart = pathMatch.index + (pathMatch[0].startsWith('\n') ? 1 : 0);
  const paths = text.slice(pathStart).trim();

  return [prestigeData, paths]
    .filter(Boolean)
    .filter((line, index, entries) => index === 0 || line !== entries[0])
    .join('\n');
}

const normalizeName = (value) => String(value || '')
  .replace(/\[\[\/?MISSING\]\]/g, '')
  .replace(/^\s*(?:[-*•]\s*)/, '')
  .replace(/\s+/g, ' ')
  .trim();

const markedMissing = (value) => /\[\[MISSING\]\]/.test(value);

const makeNode = (name, options = {}) => ({
  name: normalizeName(name),
  missing: Boolean(options.missing),
  children: options.children || []
});

function parseEquation(line) {
  const value = line
    .replace(/^\s*(?:\d+[.)]\s*|[-*•]\s*)/, '')
    .replace(/\[\[\/?MISSING\]\]/g, '')
    .trim();
  const match = value.match(/^(.+?)\s+\+\s+(.+?)\s+(?:->|=>|→|=)\s+(.+?)$/);
  if (!match) return null;
  return {
    left: normalizeName(match[1]),
    right: normalizeName(match[2]),
    output: normalizeName(match[3]),
    leftMissing: markedMissing(line.slice(0, line.indexOf('+'))),
    rightMissing: markedMissing(line.slice(line.indexOf('+') + 1, line.search(/(?:->|=>|→|=)/)))
  };
}

function buildEquationTree(lines, targetName) {
  const equations = lines
    .flatMap((line) => line.split(/\s*→\s*/))
    .map(parseEquation)
    .filter(Boolean);
  if (equations.length === 0) return null;

  const byOutput = new Map();
  for (const equation of equations) {
    if (!byOutput.has(equation.output.toLowerCase())) {
      byOutput.set(equation.output.toLowerCase(), equation);
    }
  }

  const inputs = new Set(equations.flatMap(({ left, right }) => [left.toLowerCase(), right.toLowerCase()]));
  const rootEquation = byOutput.get(String(targetName || '').trim().toLowerCase())
    || equations.find(({ output }) => !inputs.has(output.toLowerCase()))
    || equations[equations.length - 1];

  const visiting = new Set();
  const build = (name, missing = false) => {
    const key = name.toLowerCase();
    const equation = byOutput.get(key);
    if (!equation || visiting.has(key)) return makeNode(name, { missing });
    visiting.add(key);
    const node = makeNode(equation.output, {
      children: [
        build(equation.left, equation.leftMissing),
        build(equation.right, equation.rightMissing)
      ]
    });
    visiting.delete(key);
    return node;
  };

  return build(rootEquation.output);
}

function treeLineDetails(line) {
  const branchIndex = line.search(/[├└╰]─|[+\\]--/);
  if (branchIndex >= 0) {
    const prefix = line.slice(0, branchIndex);
    const depth = Math.floor(prefix.replace(/│/g, ' ').length / 4) + 1;
    return {
      depth,
      value: line.slice(branchIndex).replace(/^(?:[├└╰]─+|[+\\]-+)\s*/, '')
    };
  }

  const leading = line.match(/^\s*/)?.[0].length || 0;
  return { depth: Math.floor(leading / 2), value: line.trim() };
}

function isMetadataLine(line) {
  return /^(?:path|option|solution|result|owned crew|unowned crew|cost|total)\b/i.test(
    normalizeName(line).replace(/^#+\s*/, '')
  );
}

function buildIndentedTrees(lines) {
  const roots = [];
  const stack = [];

  for (const line of lines) {
    if (!line.trim() || isMetadataLine(line) || parseEquation(line)) continue;
    const { depth, value } = treeLineDetails(line);
    const name = normalizeName(value);
    if (!name || /^[=─━-]{3,}$/.test(name)) continue;
    const node = makeNode(name, { missing: markedMissing(value) });

    if (depth === 0 || stack.length === 0) {
      roots.push(node);
      stack.length = 0;
      stack[0] = node;
      continue;
    }

    const parent = stack[Math.min(depth - 1, stack.length - 1)];
    if (!parent) {
      roots.push(node);
      stack.length = 0;
      stack[0] = node;
      continue;
    }
    parent.children.push(node);
    stack.length = depth;
    stack[depth] = node;
  }

  return roots;
}

function splitCandidateLines(text) {
  const lines = text.split('\n');
  const candidates = [];
  let current = [];
  const dedent = (candidate) => {
    const indents = candidate
      .filter((line) => line.trim())
      .map((line) => line.match(/^\s*/)?.[0].length || 0);
    const minimum = indents.length > 0 ? Math.min(...indents) : 0;
    return minimum > 0 ? candidate.map((line) => line.slice(minimum)) : candidate;
  };
  const flush = () => {
    if (current.some((line) => line.trim())) candidates.push(dedent(current));
    current = [];
  };

  for (const line of lines) {
    const heading = normalizeName(line).match(/^\s*(?:path|option|solution)\s*#?\d+\s*:?\s*(.*)$/i);
    if (heading) {
      flush();
      if (heading[1]) current.push(heading[1]);
      continue;
    }
    current.push(line);
  }
  flush();
  return candidates.length > 0 ? candidates : [lines];
}

export function getPrestigeTreeMetrics(root) {
  const visit = (node, depth) => {
    const children = node.children || [];
    const childMetrics = children.map((child) => visit(child, depth + 1));
    return {
      missing: (node.missing ? 1 : 0) + childMetrics.reduce((sum, item) => sum + item.missing, 0),
      operations: (children.length >= 2 ? 1 : 0) + childMetrics.reduce((sum, item) => sum + item.operations, 0),
      leaves: (children.length === 0 ? 1 : 0) + childMetrics.reduce((sum, item) => sum + item.leaves, 0),
      depth: Math.max(depth, ...childMetrics.map((item) => item.depth))
    };
  };
  return visit(root, 0);
}

const inventoryCrewName = (value) => normalizeName(value)
  .replace(/\s*\(\d+\)\s*$/, '')
  .trim()
  .toLowerCase();

export function parseCrewInventory(value) {
  const inventory = new Map();
  const entries = String(value || '').split(/[\n,]+/);

  for (const entry of entries) {
    const match = entry.trim().match(/^(?:(\d+)\s*[x×]\s*)?(.+?)$/i);
    if (!match) continue;
    const count = Math.max(1, Number(match[1]) || 1);
    const name = normalizeName(match[2]);
    const key = inventoryCrewName(name);
    if (!key) continue;
    const current = inventory.get(key) || { name, count: 0 };
    current.count += count;
    inventory.set(key, current);
  }

  return inventory;
}

export function expandCrewInventory(value) {
  return [...parseCrewInventory(value).values()]
    .flatMap(({ name, count }) => Array.from({ length: count }, () => name))
    .join(', ');
}

const MANUAL_CREW_ALIASES = new Map([
  ['student', 'Good student'],
  ['pilot', 'Civilian Pilot'],
  ['visiri assasin', 'Visiri Assassin'],
  ['keria', 'Keira'],
  ['mr clay', 'Mr Cray'],
  ['olympic pagan burger', 'Olympian Pagan Burger'],
  ['sportman ronny', 'Sportsman Ronny']
]);

function editDistance(left, right) {
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[b.length];
}

export function resolveCrewInventory(value, crewCatalog = []) {
  const parsed = parseCrewInventory(value);
  const catalogNames = crewCatalog.map((crew) => String(crew?.name || crew)).filter(Boolean);
  const exact = new Map(catalogNames.map((name) => [name.toLowerCase(), name]));
  const resolved = new Map();
  const corrections = [];
  const unmatched = [];

  for (const { name, count } of parsed.values()) {
    const key = name.toLowerCase();
    let canonical = exact.get(key) || exact.get(MANUAL_CREW_ALIASES.get(key)?.toLowerCase());
    if (!canonical && catalogNames.length > 0) {
      const ranked = catalogNames
        .map((candidate) => ({ candidate, distance: editDistance(name, candidate) }))
        .sort((a, b) => a.distance - b.distance);
      const threshold = Math.max(2, Math.floor(name.length * 0.2));
      if (ranked[0]?.distance <= threshold && ranked[0].distance < (ranked[1]?.distance ?? Infinity)) {
        canonical = ranked[0].candidate;
      }
    }
    canonical ||= name;
    if (canonical.toLowerCase() !== key) corrections.push({ from: name, to: canonical });
    if (!exact.has(canonical.toLowerCase()) && catalogNames.length > 0) unmatched.push(name);
    const canonicalKey = canonical.toLowerCase();
    const current = resolved.get(canonicalKey) || { name: canonical, count: 0 };
    current.count += count;
    resolved.set(canonicalKey, current);
  }

  return {
    text: [...resolved.values()].map(({ name, count }) => `${count}x${name}`).join('\n'),
    corrections,
    unmatched
  };
}

export function rankPrestigeOptionsForInventory(options, inventoryValue) {
  const inventory = parseCrewInventory(inventoryValue);

  return (options || []).map((option) => {
    const used = new Map();
    const requirements = new Map();
    const clone = (node) => {
      const children = (node.children || []).map(clone);
      if (children.length > 0) return { ...node, missing: false, children };

      const key = inventoryCrewName(node.name);
      const nextUsed = (used.get(key) || 0) + 1;
      used.set(key, nextUsed);
      requirements.set(key, nextUsed);
      return {
        ...node,
        missing: nextUsed > (inventory.get(key)?.count || 0),
        children: []
      };
    };
    const root = clone(option.root);
    const craftableCopies = requirements.size === 0
      ? 0
      : Math.min(...[...requirements].map(([key, required]) => (
        Math.floor((inventory.get(key)?.count || 0) / required)
      )));

    return { root, metrics: getPrestigeTreeMetrics(root), craftableCopies };
  }).sort((a, b) => (
    b.craftableCopies - a.craftableCopies
    || compareOptions(a, b)
  ));
}

function leafRequirements(root) {
  const requirements = new Map();
  const visit = (node) => {
    if (node.children?.length) {
      node.children.forEach(visit);
      return;
    }
    const key = inventoryCrewName(node.name);
    requirements.set(key, (requirements.get(key) || 0) + 1);
  };
  visit(root);
  return requirements;
}

export function optimizeConcurrentPrestigePlan(options, inventoryValue, targetName = '', recipeCatalog = []) {
  const inventory = parseCrewInventory(inventoryValue);
  const uniqueRecipes = new Map();
  const addRecipe = (outputName, inputNames) => {
    const output = inventoryCrewName(outputName);
    const inputs = inputNames.map((name) => ({
      key: inventoryCrewName(name),
      name: normalizeName(name).replace(/\s*\(\d+\)\s*$/, '')
    }));
    if (!output || inputs.length !== 2 || inputs.some(({ key }) => !key)) return;
    const recipeKey = `${output}<-${inputs.map(({ key }) => key).sort().join('+')}`;
    if (!uniqueRecipes.has(recipeKey)) {
      uniqueRecipes.set(recipeKey, {
        output,
        outputName: normalizeName(outputName).replace(/\s*\(\d+\)\s*$/, ''),
        inputs
      });
    }
  };
  recipeCatalog.forEach(({ left, right, output }) => addRecipe(output, [left, right]));
  const collectRecipes = (node) => {
    if (!node?.children?.length) return;
    node.children.forEach(collectRecipes);
    if (node.children.length !== 2) return;
    addRecipe(node.name, node.children.map((child) => child.name));
  };
  (options || []).forEach(({ root }) => collectRecipes(root));
  let recipes = [...uniqueRecipes.values()];
  const targetKey = inventoryCrewName(targetName || options?.[0]?.root?.name);
  if (recipes.length === 0 || !targetKey) {
    return { maximumCopies: 0, routes: [], exact: true };
  }

  const producible = new Set(
    [...inventory].filter(([, { count }]) => count > 0).map(([key]) => key)
  );
  let changed = true;
  while (changed) {
    changed = false;
    for (const recipe of recipes) {
      if (producible.has(recipe.output) || !recipe.inputs.every(({ key }) => producible.has(key))) continue;
      producible.add(recipe.output);
      changed = true;
    }
  }
  if (!producible.has(targetKey)) {
    return { maximumCopies: 0, routes: [], exact: true };
  }

  const needed = new Set([targetKey]);
  changed = true;
  while (changed) {
    changed = false;
    for (const recipe of recipes) {
      if (!needed.has(recipe.output) || !recipe.inputs.every(({ key }) => producible.has(key))) continue;
      for (const { key } of recipe.inputs) {
        if (!needed.has(key)) {
          needed.add(key);
          changed = true;
        }
      }
    }
  }
  recipes = recipes.filter((recipe) => (
    needed.has(recipe.output)
    && recipe.inputs.every(({ key }) => producible.has(key))
  ));

  const crewKeys = [...new Set([
    ...inventory.keys(),
    ...recipes.flatMap(({ output, inputs }) => [output, ...inputs.map(({ key }) => key)])
  ])].filter((key) => key !== targetKey).sort();
  const crewIndex = new Map(crewKeys.map((key, index) => [key, index]));
  const constraints = Object.fromEntries(crewKeys.map((key, index) => [
    `crew_${index}`,
    { max: inventory.get(key)?.count || 0 }
  ]));
  const variables = {};
  const ints = {};
  recipes.forEach((recipe, recipeIndex) => {
    const variableName = `recipe_${recipeIndex}`;
    variables[variableName] = { targets: recipe.output === targetKey ? 1 : 0 };
    recipe.inputs.forEach(({ key }) => {
      if (key === targetKey) return;
      const constraint = `crew_${crewIndex.get(key)}`;
      variables[variableName][constraint] = (variables[variableName][constraint] || 0) + 1;
    });
    if (recipe.output !== targetKey) {
      const constraint = `crew_${crewIndex.get(recipe.output)}`;
      variables[variableName][constraint] = (variables[variableName][constraint] || 0) - 1;
    }
    ints[variableName] = 1;
  });

  const solution = solver.Solve({
    optimize: 'targets',
    opType: 'max',
    constraints,
    variables,
    ints,
    timeout: 20000,
    tolerance: 0
  });
  const remainingRecipeCounts = new Map();
  recipes.forEach((recipe, recipeIndex) => {
    const count = Math.round(Number(solution[`recipe_${recipeIndex}`]) || 0);
    if (count > 0) remainingRecipeCounts.set(recipeIndex, count);
  });
  const recipesByOutput = new Map();
  recipes.forEach((recipe, recipeIndex) => {
    const list = recipesByOutput.get(recipe.output) || [];
    list.push(recipeIndex);
    recipesByOutput.set(recipe.output, list);
  });
  const buildPlannedNode = (key, fallbackName) => {
    const recipeIndex = (recipesByOutput.get(key) || [])
      .find((index) => (remainingRecipeCounts.get(index) || 0) > 0);
    if (recipeIndex === undefined) return makeNode(fallbackName);
    remainingRecipeCounts.set(recipeIndex, remainingRecipeCounts.get(recipeIndex) - 1);
    const recipe = recipes[recipeIndex];
    return makeNode(recipe.outputName, {
      children: recipe.inputs.map((input) => buildPlannedNode(input.key, input.name))
    });
  };
  const targetCopies = Math.max(0, Math.round(Number(solution.result) || 0));
  const groupedRoutes = new Map();
  for (let index = 0; index < targetCopies; index += 1) {
    const root = buildPlannedNode(targetKey, targetName);
    const signature = JSON.stringify(root);
    const existing = groupedRoutes.get(signature);
    if (existing) existing.plannedCopies += 1;
    else groupedRoutes.set(signature, {
      root,
      metrics: getPrestigeTreeMetrics(root),
      plannedCopies: 1
    });
  }
  const routes = [...groupedRoutes.values()]
    .sort((a, b) => b.plannedCopies - a.plannedCopies || compareOptions(a, b));

  return {
    maximumCopies: targetCopies,
    routes,
    exact: Boolean(solution.feasible && solution.bounded),
    objectiveValue: Number(solution.result) || 0
  };
}

function compareOptions(a, b) {
  return a.metrics.missing - b.metrics.missing
    || a.metrics.operations - b.metrics.operations
    || a.metrics.depth - b.metrics.depth
    || a.metrics.leaves - b.metrics.leaves;
}

const comparableCrewName = (value) => normalizeName(value)
  .replace(/^(?:target(?: crew)?|result)\s*:\s*/i, '')
  .replace(/\s*\([^)]*\)\s*$/, '')
  .trim()
  .toLowerCase();

function isRequestedTarget(root, targetName) {
  const target = comparableCrewName(targetName);
  const rootName = comparableCrewName(root?.name);
  if (!target || !rootName) return false;
  return rootName === target
    || rootName.startsWith(`${target} `)
    || rootName.endsWith(` ${target}`);
}

export function parsePrestigePaths(rawHtml, targetName = '') {
  const text = preprocessPrestigeText(prestigeHtmlToText(rawHtml));
  if (!text || extractPrestigeError(rawHtml)) return { text, options: [], optimal: null };

  const options = [];
  for (const lines of splitCandidateLines(text)) {
    const equationTree = buildEquationTree(lines, targetName);
    const roots = equationTree ? [equationTree] : buildIndentedTrees(lines);
    for (const root of roots) {
      if (!root?.name) continue;
      options.push({ root, metrics: getPrestigeTreeMetrics(root) });
    }
  }

  const targetOptions = options.filter(
    ({ root, metrics }) => isRequestedTarget(root, targetName) && metrics.operations > 0,
  );
  const structuredOptions = options.filter(({ metrics }) => metrics.operations > 0);
  const validOptions = targetOptions.length > 0
    ? targetOptions
    : structuredOptions;

  validOptions.sort(compareOptions);
  return { text, options: validOptions, optimal: validOptions[0] || null };
}
