import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, CheckCircle2, GitMerge, Search, Sparkles
} from 'lucide-react';
import { runManualPrestigePathFinder, runPrestigePathFinder } from '../services/realityApi';
import {
  expandCrewInventory, optimizeConcurrentPrestigePlan, parsePrestigePaths,
  rankPrestigeOptionsForInventory, resolveCrewInventory
} from '../features/prestige/prestigePath';
import { PrestigeTree } from '../features/prestige/PrestigeTree';
import { publicUrl } from '../utils/publicUrl';
import { useTranslation } from '../i18n/useTranslation';

const PRESTIGE_RESULT_CACHE_PREFIX = 'pss_prestige_latest_result:v1';

const prestigeResultCacheKey = (mode) => `${PRESTIGE_RESULT_CACHE_PREFIX}:${mode}`;

function readCachedPrestigeResult(mode) {
  try {
    const cached = JSON.parse(localStorage.getItem(prestigeResultCacheKey(mode)) || 'null');
    if (cached?.mode !== mode || cached?.result?.status !== 'success' || !cached?.parsed) return null;
    return cached;
  } catch {
    return null;
  }
}

function writeCachedPrestigeResult(mode, payload) {
  try {
    localStorage.setItem(prestigeResultCacheKey(mode), JSON.stringify({
      version: 1,
      mode,
      savedAt: new Date().toISOString(),
      ...payload
    }));
  } catch {
    // A calculation remains usable in memory when browser storage is unavailable.
  }
}

const SmartAdvisor = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState('automatic');
  const [shipName, setShipName] = useState('');
  const [targetCrew, setTargetCrew] = useState('Paralympic God');
  const [unownedExclude, setUnownedExclude] = useState('');
  const [unownedExtra, setUnownedExtra] = useState('');
  const [manualCrew, setManualCrew] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const [crews, setCrews] = useState([]);
  const [prestigeRecipes, setPrestigeRecipes] = useState([]);
  const [prestigeRecipesLoaded, setPrestigeRecipesLoaded] = useState(false);

  const restoreCachedResult = (nextMode) => {
    const cached = readCachedPrestigeResult(nextMode);
    setSelectedPathIndex(cached?.selectedPathIndex || 0);
    if (!cached) {
      setResult(null);
      return;
    }

    const inputs = cached.inputs || {};
    setTargetCrew(inputs.targetCrew || 'Paralympic God');
    if (nextMode === 'automatic') {
      setShipName(inputs.shipName || '');
      setUnownedExclude(inputs.unownedExclude || '');
      setUnownedExtra(inputs.unownedExtra || '');
    } else {
      setManualCrew(inputs.manualCrew || '');
    }
    setResult({ ...cached.result, cachedParsed: cached.parsed });
  };

  useEffect(() => {
    let cancelled = false;
    fetch(publicUrl('/data/active/crew.json'))
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setCrews(data);
      })
      .catch(() => {});
    fetch(`${publicUrl('/data/active/prestigeRecipes.json')}?v=2026-08-31-verified`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setPrestigeRecipes(data.recipes || []);
          setPrestigeRecipesLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setPrestigeRecipesLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    restoreCachedResult('automatic');
  }, []);

  const crewByName = useMemo(() => new Map(
    crews.map((crew) => [crew.name.toLowerCase(), crew])
  ), [crews]);
  const parsed = useMemo(() => {
    if (result?.status !== 'success') return null;
    if (result.cachedParsed) return result.cachedParsed;
    const base = parsePrestigePaths(result.output, result.targetCrew || targetCrew);
    if (result.calculationMode !== 'manual') return base;
    const options = rankPrestigeOptionsForInventory(base.options, result.manualCrew);
    const concurrentPlan = optimizeConcurrentPrestigePlan(
      options,
      result.manualCrew,
      result.targetCrew,
      prestigeRecipes
    );
    return { ...base, options, optimal: options[0] || null, concurrentPlan };
  }, [result, targetCrew, prestigeRecipes]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isManual = mode === 'manual';
    if (!targetCrew.trim() || (isManual ? (!manualCrew.trim() || !prestigeRecipesLoaded) : !shipName.trim())) return;
    setLoading(true);
    setResult(null);
    setSelectedPathIndex(0);
    const resolvedInventory = isManual
      ? resolveCrewInventory(manualCrew, crews)
      : null;
    const data = isManual
      ? await runManualPrestigePathFinder(targetCrew.trim(), expandCrewInventory(resolvedInventory.text))
      : await runPrestigePathFinder(
        shipName.trim(),
        targetCrew.trim(),
        unownedExclude.trim(),
        unownedExtra.trim()
      );
    setResult({
      ...data,
      calculationMode: mode,
      manualCrew: isManual ? resolvedInventory.text : '',
      inventoryCorrections: resolvedInventory?.corrections || [],
      unmatchedCrew: resolvedInventory?.unmatched || [],
      targetCrew: targetCrew.trim(),
      inputs: {
        targetCrew: targetCrew.trim(),
        shipName: shipName.trim(),
        unownedExclude,
        unownedExtra,
        manualCrew
      }
    });
    setLoading(false);
  };

  const manualPlanRoutes = parsed?.concurrentPlan?.routes || [];
  const rankedOptions = result?.calculationMode === 'manual'
    ? (manualPlanRoutes.length > 0 ? manualPlanRoutes : parsed?.options || [])
    : (parsed?.options || []).slice(0, 20);
  const optimal = rankedOptions[selectedPathIndex] || rankedOptions[0] || null;

  useEffect(() => {
    if (result?.status !== 'success' || !parsed || !optimal) return;

    const candidateCount = parsed.candidateCount ?? parsed.options.length;
    const compactOptions = result.calculationMode === 'manual'
      ? manualPlanRoutes
      : parsed.options.slice(0, 20);
    const compactParsed = {
      text: '',
      options: compactOptions,
      optimal: compactOptions[0] || null,
      candidateCount,
      ...(result.calculationMode === 'manual'
        ? { concurrentPlan: { ...parsed.concurrentPlan, routes: manualPlanRoutes } }
        : {})
    };
    const { output: _output, cachedParsed: _cachedParsed, ...compactResult } = result;

    writeCachedPrestigeResult(result.calculationMode, {
      inputs: result.inputs || {},
      result: compactResult,
      parsed: compactParsed,
      selectedPathIndex
    });
  }, [result, parsed, optimal, manualPlanRoutes, selectedPathIndex]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
            <GitMerge className="h-4 w-4" /> {t('pages.prestige.eyebrow')}
          </div>
          <h1 className="page-title">{t('pages.prestige.title')}</h1>
          <p className="mt-1 max-w-3xl text-xs text-slate-400">
            {t('pages.prestige.description')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
        <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-950 p-1" role="tablist" aria-label={t('pages.prestige.inputMode')}>
          {['automatic', 'manual'].map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => { setMode(value); restoreCachedResult(value); }}
              className={`rounded-md px-4 py-2.5 text-xs font-black transition ${mode === value ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'}`}
            >
              {t(`pages.prestige.${value}Tab`)}
            </button>
          ))}
        </div>
        <p className="mb-4 text-xs text-slate-400">
          {t(`pages.prestige.${mode}Description`)}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {mode === 'automatic' ? (
            <>
              <label className="space-y-1.5 text-xs font-bold text-slate-300">
                <span>{t('pages.prestige.shipName')}</span>
                <input type="text" value={shipName} onChange={(event) => setShipName(event.target.value)} placeholder={t('pages.prestige.shipNamePlaceholder')} className="w-full rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </label>
              <label className="space-y-1.5 text-xs font-bold text-slate-300">
                <span>{t('pages.prestige.excludeOwned')} <span className="font-normal text-slate-500">{t('pages.prestige.optionalCommaSeparated')}</span></span>
                <textarea value={unownedExclude} onChange={(event) => setUnownedExclude(event.target.value)} rows={3} placeholder={t('pages.prestige.excludePlaceholder')} className="w-full resize-y rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </label>
              <label className="space-y-1.5 text-xs font-bold text-slate-300 md:col-span-2">
                <span>{t('pages.prestige.additionalCrew')} <span className="font-normal text-slate-500">{t('pages.prestige.optional')}</span></span>
                <textarea value={unownedExtra} onChange={(event) => setUnownedExtra(event.target.value)} rows={3} placeholder={t('pages.prestige.additionalCrewPlaceholder')} className="w-full resize-y rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </label>
            </>
          ) : (
            <label className="space-y-1.5 text-xs font-bold text-slate-300 md:col-span-2">
              <span>{t('pages.prestige.existingCrew')}</span>
              <textarea value={manualCrew} onChange={(event) => setManualCrew(event.target.value)} rows={12} placeholder={t('pages.prestige.existingCrewPlaceholder')} className="w-full resize-y rounded-lg bg-slate-950 px-3 py-2.5 font-mono text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </label>
          )}
          <label className="space-y-1.5 text-xs font-bold text-slate-300 md:col-span-2">
            <span>{t('pages.prestige.targetCrew')}</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input type="text" list="prestige-crew-options" value={targetCrew} onChange={(event) => setTargetCrew(event.target.value)} required className="w-full rounded-lg bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30" />
              <datalist id="prestige-crew-options">{crews.map((crew) => <option key={crew.id} value={crew.name} />)}</datalist>
            </div>
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading || !targetCrew.trim() || (mode === 'manual' ? (!manualCrew.trim() || !prestigeRecipesLoaded) : !shipName.trim())}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-black text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <GitMerge className="h-4 w-4" />}
            {loading ? t('pages.prestige.calculating') : t('pages.prestige.findPath')}
          </button>
          <p className="text-[10px] text-slate-500">{t(`pages.prestige.${mode}Requirement`)}</p>
        </div>
      </form>

      {result?.status === 'error' && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-900/60 bg-rose-950/30 p-4 text-sm text-rose-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div><div className="font-black">{t('pages.prestige.errorTitle')}</div><div className="mt-1 text-xs">{result.message}</div></div>
        </div>
      )}

      {result?.calculationMode === 'manual' && (result.inventoryCorrections.length > 0 || result.unmatchedCrew.length > 0) && (
        <div className="rounded-lg border border-sky-900/60 bg-sky-950/30 p-4 text-xs text-sky-200">
          {result.inventoryCorrections.length > 0 && (
            <div><span className="font-black">{t('pages.prestige.resolvedNames')}:</span> {result.inventoryCorrections.map(({ from, to }) => `${from} → ${to}`).join(', ')}</div>
          )}
          {result.unmatchedCrew.length > 0 && (
            <div className="mt-1"><span className="font-black">{t('pages.prestige.unmatchedNames')}:</span> {result.unmatchedCrew.join(', ')}</div>
          )}
        </div>
      )}

      {result?.status === 'success' && optimal && (
        <section className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-black text-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> {t(`pages.prestige.${result.calculationMode === 'manual' ? 'manualPlanTitle' : 'optimalPaths'}`)}
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                {result.calculationMode === 'manual'
                  ? t('pages.prestige.manualPlanSummary', {
                    copies: parsed.concurrentPlan?.maximumCopies || 0,
                    routes: manualPlanRoutes.length,
                    count: parsed.candidateCount ?? parsed.options.length
                  })
                  : t('pages.prestige.showingTopPaths', { shown: rankedOptions.length, count: parsed.candidateCount ?? parsed.options.length })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide">
              {result.calculationMode === 'manual' && (
                <span className="rounded-full bg-indigo-950 px-3 py-1.5 text-indigo-300">{parsed.concurrentPlan?.maximumCopies || 0} {t('pages.prestige.maximumCopies')}</span>
              )}
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-slate-300">{optimal.metrics.operations} {t('pages.prestige.prestiges')}</span>
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-slate-300">{optimal.metrics.leaves} {t('pages.prestige.ingredients')}</span>
              <span className={`rounded-full px-3 py-1.5 ${optimal.metrics.missing ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {optimal.metrics.missing} {t('pages.prestige.missing')}
              </span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" role="tablist" aria-label={t(`pages.prestige.${result.calculationMode === 'manual' ? 'manualPlanTitle' : 'optimalPaths'}`)}>
            {rankedOptions.map((option, index) => (
              <button
                key={`${option.root.name}-${index}`}
                type="button"
                role="tab"
                aria-selected={selectedPathIndex === index}
                onClick={() => setSelectedPathIndex(index)}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  selectedPathIndex === index
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-100'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wide">{t('pages.prestige.pathNumber', { number: index + 1 })}</div>
                <div className="mt-1 font-mono text-[9px]">
                  {result.calculationMode === 'manual' && <>{option.plannedCopies || 0} {t('pages.prestige.plannedUses')} · </>}
                  {option.metrics.operations} {t('pages.prestige.prestiges')} · {option.metrics.leaves} {t('pages.prestige.ingredients')} · {option.metrics.missing} {t('pages.prestige.missing')}
                </div>
              </button>
            ))}
          </div>
          <PrestigeTree root={optimal.root} crewByName={crewByName} />
        </section>
      )}

      {result?.status === 'success' && !optimal && (
        <section className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-amber-300"><AlertCircle className="h-5 w-5" /> {t('pages.prestige.unknownFormat')}</div>
          <pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-xs text-slate-300">{parsed?.text || t('pages.prestige.noPath')}</pre>
        </section>
      )}
    </div>
  );
};

export default SmartAdvisor;
