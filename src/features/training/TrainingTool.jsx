import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, BatteryCharging, BookOpen, ChevronDown,
  Clock3, Dumbbell, Info, RotateCcw, Search, Sparkles, Target
} from 'lucide-react';
import fallbackTrainingPrograms from '../../../training_designs_parsed.json';
import { SEOHead } from '../../components/SEOHead';
import { useTranslation } from '../../i18n/useTranslation';
import { publicUrl } from '../../utils/publicUrl';
import {
  EMPTY_TRAINING, TRAINING_STATS, clampTrainingValue,
  calculateTrainedStat, calculateTrainingPossibilities, formatDuration, getTrainingCapacity,
  isPrimaryTrainingStat, recommendPrograms, summarizeTraining
} from './trainingCalculations';

const panel = 'rounded-xl bg-slate-900 shadow-sm';
const input = 'w-full rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500/20';
const number = (value, digits = 1) => new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value || 0);
const FATIGUE_EXPRESSION_SPRITES = [9970, 9730, 9731, 9732, 9733, 9734, 9735, 9736, 9737, 9738, 9739];

function getFatigueState(fatigue) {
  if (fatigue >= 90) return { color: 'text-rose-300', glow: 'from-rose-500/25' };
  if (fatigue >= 65) return { color: 'text-orange-300', glow: 'from-orange-500/25' };
  if (fatigue >= 35) return { color: 'text-amber-300', glow: 'from-amber-500/20' };
  return { color: 'text-emerald-300', glow: 'from-emerald-500/20' };
}

function FatigueSprite({ fatigue, size = 28 }) {
  const step = fatigue <= 0 ? 0 : Math.min(10, Math.max(1, Math.ceil(fatigue / 10)));
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }} aria-label={`Fatigue ${fatigue} of 100`}>
      <img
        src={publicUrl('/assets/sprites/9729.webp')}
        alt=""
        className="absolute inset-0 h-full w-full [image-rendering:pixelated]"
        style={{ filter: 'sepia(1) saturate(8) hue-rotate(350deg) brightness(1.2)' }}
      />
      {FATIGUE_EXPRESSION_SPRITES.map((spriteId, index) => (
        <img
          key={spriteId}
          src={publicUrl(`/assets/sprites/${spriteId}.webp`)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full [image-rendering:pixelated] transition-none ${index === step ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </span>
  );
}

function InfoTooltip({ text }) {
  return (
    <span className="group/tooltip relative inline-flex shrink-0">
      <span
        tabIndex="0"
        aria-label={text}
        className="cursor-help text-slate-500 outline-none transition hover:text-cyan-300 focus:text-cyan-300"
      >
        <Info className="h-3.5 w-3.5" />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-[80] mb-2 w-64 -translate-x-1/2 rounded-md bg-slate-950 px-3 py-2 text-left text-[10px] font-medium normal-case leading-relaxed tracking-normal text-slate-200 opacity-0 shadow-2xl transition-opacity group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function HoldStepButton({ direction, disabled, onStep, label, className }) {
  const timerRef = useRef(null);
  const holdStartedAtRef = useRef(0);

  const stopRepeating = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => stopRepeating, []);

  const repeat = () => {
    const heldFor = performance.now() - holdStartedAtRef.current;
    const amount = heldFor >= 3000 ? 5 : heldFor >= 1500 ? 2 : 1;
    const delay = Math.max(45, 140 - Math.floor(heldFor / 30));
    onStep(direction * amount);
    timerRef.current = window.setTimeout(repeat, delay);
  };

  const startRepeating = (event) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    stopRepeating();
    onStep(direction);
    holdStartedAtRef.current = performance.now();
    timerRef.current = window.setTimeout(repeat, 380);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={startRepeating}
      onPointerUp={stopRepeating}
      onPointerCancel={stopRepeating}
      onLostPointerCapture={stopRepeating}
      onClick={(event) => {
        // Keyboard and assistive-technology clicks do not trigger pointerdown.
        if (event.detail === 0 && !disabled) onStep(direction);
      }}
      onContextMenu={(event) => event.preventDefault()}
      className={`${className} select-none touch-none`}
      aria-label={label}
      title={label}
    >
      {direction < 0 ? '−' : '+'}
    </button>
  );
}

function CrewStage({ crew, crewId, selectedCrew, capacity, summary, fatigue, loading, onCrewChange, onFatigueChange, t }) {
  const state = getFatigueState(fatigue);
  const usedPercent = capacity ? Math.min((summary.spent / capacity) * 100, 100) : 0;
  const fatiguePercent = Math.min(Math.max(fatigue, 0), 100);

  return (
    <section className={`${panel} flex min-h-[540px] flex-col overflow-hidden xl:h-full xl:min-h-0`}>
      <div className="bg-[#073b63] px-4 py-2.5">
        <div className="block">
          <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">{t('training.crewDetails')}</span>
          <div className="relative">
            <select disabled={loading} value={crewId} onChange={(event) => onCrewChange(event.target.value)} title={t('training.crewChangeHint')} className={`${input} appearance-none bg-[#082f4d] pr-9 font-bold`}>
              {loading && <option>{t('common.loadingShort')}</option>}
              {crew.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.rarity}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-cyan-300" />
          </div>
        </div>
      </div>

      <div className={`relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${state.glow} via-[#082f4d] to-[#061f35] px-5 py-4`}>
        <div className="absolute inset-x-8 top-1/2 h-px bg-cyan-300/25" />
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-slate-950/60 px-2.5 py-1.5 backdrop-blur">
          <FatigueSprite fatigue={fatigue} size={28} />
          <div className="text-[9px] font-bold text-slate-400">{fatigue}/100</div>
        </div>

        {selectedCrew && <>
          <div className="relative z-10 flex h-40 w-40 items-center justify-center 2xl:h-48 2xl:w-48">
            <div className="absolute inset-3 rounded-full bg-cyan-400/10 blur-2xl" />
            <img
              src={publicUrl(`/assets/sprites/${selectedCrew.profileSpriteId}.webp`)}
              alt={selectedCrew.name}
              className={`relative max-h-full max-w-full scale-[1.65] object-contain [image-rendering:pixelated] transition-all duration-300 ${fatigue >= 90 ? 'grayscale contrast-75' : fatigue >= 65 ? 'saturate-50' : ''}`}
            />
          </div>
          <div className="relative z-10 mt-3 text-center">
            <h2 className="text-xl font-black text-yellow-300">{selectedCrew.name}</h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/70">{selectedCrew.rarity} · Lv. {selectedCrew.maxLevel}</p>
          </div>
        </>}
      </div>

      <div className="space-y-3 bg-[#073b63] p-3.5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-black text-cyan-100">
            <span>{t('training.training')}</span>
            <span className="font-mono">{summary.spent}/{capacity}</span>
          </div>
          <div title={`${summary.spent} of ${capacity} training points allocated`} className="h-3 overflow-hidden rounded-sm bg-[#041e31] p-0.5">
            <div className={`h-full transition-all ${summary.overCapacity ? 'bg-rose-500' : 'bg-yellow-400'}`} style={{ width: `${usedPercent}%` }} />
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-wider text-cyan-200/70">
            <span>{t('training.fatigue')}</span>
            <span className={`flex items-center gap-1.5 ${state.color}`}><FatigueSprite fatigue={fatigue} size={18} />{fatigue}/100</span>
          </span>
          <div className="relative">
            <input type="range" min="0" max="100" value={fatigue} onChange={(event) => onFatigueChange(Number(event.target.value))} title={t('training.fatigueHint')} className="relative z-10 w-full accent-cyan-400" />
            <div className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-orange-400/30" style={{ width: `${fatiguePercent}%` }} />
          </div>
        </label>
      </div>
    </section>
  );
}

function ProgramSelector({ programs, selectedId, selected, target, maxTargetPoints, onSelect, onTargetChange, t, embedded = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const targetPrograms = programs.filter((program) => isPrimaryTrainingStat(program, target));
  const repeatable = targetPrograms.filter((program) => Number(program.rank) !== 100);
  const consumables = targetPrograms.filter((program) => Number(program.rank) === 100);
  const targetLabel = TRAINING_STATS.find((stat) => stat.key === target)?.label || target.toUpperCase();
  const outcomeTooltip = selected
    ? t('training.outcomeHint', { item: selected.name, points: number(maxTargetPoints), stat: targetLabel })
    : t('training.selectProgramHint');

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const renderOption = (program) => (
    <button
      key={program.id}
      type="button"
      role="option"
      aria-selected={program.id === selected?.id}
      onClick={() => {
        onSelect(program.id);
        setIsOpen(false);
      }}
      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-cyan-500/15 ${program.id === selected?.id ? 'bg-blue-600 text-white' : 'text-cyan-50'
        }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-950/70">
        <img src={publicUrl(`/assets/sprites/${program.spriteId}.webp`)} alt="" className="h-8 w-8 object-contain [image-rendering:pixelated]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold">{program.name}</span>
        <span className={`block text-[10px] ${program.id === selected?.id ? 'text-blue-100' : 'text-cyan-300/60'}`}>
          {Number(program.rank) === 100
            ? t('training.instantConsumable')
            : `${formatDuration(program.duration)} · +${program.fatigue} fatigue`}
        </span>
      </span>
    </button>
  );

  return (
    <section className={`${embedded ? 'relative z-30 bg-slate-900' : `${panel} relative z-30`} overflow-visible`}>
      <div className="bg-[#073b63] px-4 py-2.5">
        <div className="flex items-center gap-2 text-cyan-200">
          <Dumbbell className="h-4 w-4" />
          <h2 className="text-sm font-black uppercase tracking-wider">{t('training.station')}</h2>
        </div>
      </div>
      <div className={`space-y-3 ${embedded ? 'p-3.5' : 'p-5'}`}>
        <div className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {t('training.programOrItem')}
            <InfoTooltip text={outcomeTooltip} />
          </span>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              title={outcomeTooltip}
              className={`${input} flex min-h-12 items-center gap-3 bg-[#082f4d] py-1.5 pr-10 text-left`}
            >
              {selected && <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-950/70">
                <img src={publicUrl(`/assets/sprites/${selected.spriteId}.webp`)} alt="" className="h-8 w-8 object-contain [image-rendering:pixelated]" />
              </span>}
              <span className="min-w-0">
                <span className="block truncate text-base font-black text-cyan-100">{selected?.name || t('training.selectProgram')}</span>
                {selected && <span className="block text-[10px] text-cyan-300/60">
                  {Number(selected.rank) === 100 ? t('training.instantConsumable') : `${formatDuration(selected.duration)} · +${selected.fatigue} ${t('training.fatigue').toLowerCase()}`}
                </span>}
              </span>
            </button>
            <ChevronDown className={`pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-cyan-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            {isOpen && (
              <div role="listbox" className="absolute z-50 mt-1 max-h-[430px] w-full overflow-y-auto bg-[#082f4d] shadow-2xl rounded-lg">
                {repeatable.length > 0 && <>
                  <div className="sticky top-0 z-10 bg-[#061f35] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                    {t('training.programs')}
                  </div>
                  {repeatable.map(renderOption)}
                </>}
                {consumables.length > 0 && <>
                  <div className="sticky top-0 z-10 bg-[#061f35] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                    {t('training.instantItems')}
                  </div>
                  {consumables.map(renderOption)}
                </>}
              </div>
            )}
          </div>
        </div>

        <div>
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
            {t('training.targetStat')}
            <InfoTooltip text={t('training.targetFilterHint', { stat: targetLabel })} />
          </span>
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-9">
            {TRAINING_STATS.map((stat) => <button key={stat.key} onClick={() => onTargetChange(stat.key)} title={t('training.setTargetHint', { stat: stat.label })} className={`rounded-md px-2 py-1.5 text-xs font-black transition ${target === stat.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'}`}>{stat.label}</button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrainingStats({ selectedCrew, training, capacity, summary, distribution, fatigue, selectedProgram, onSimulate, onReset, lang, onChange, onStep, t, children }) {
  const renderStat = (stat) => {
    const outcome = distribution.find((row) => row.key === stat.key);
    const base = stat.crewKey ? selectedCrew?.[stat.crewKey] : null;
    const value = training[stat.key];
    const trained = calculateTrainedStat(base, value, stat.key);
    return (
      <div key={stat.key} title={base != null ? `${stat.label}: ${number(base)} base × (1 + ${value}%) = ${number(trained)}` : `${stat.label} has no base stat available.`} className="grid w-full min-w-0 grid-cols-[28px_max-content_minmax(30px,1fr)_120px] items-center gap-1 sm:grid-cols-[34px_96px_minmax(38px,1fr)_120px] sm:gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#07517b] sm:h-8 sm:w-8">
          <img src={publicUrl(`/assets/sprites/${stat.spriteId}.webp`)} alt="" className="h-6 w-6 object-contain [image-rendering:pixelated] sm:h-7 sm:w-7" />
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className="text-sm font-black leading-none sm:text-base" style={{ color: stat.color }}>{stat.label}</div>
          <div className="mt-0.5 flex min-w-0 items-baseline whitespace-nowrap">
            {base != null
              ? <span className="text-xs font-black leading-none text-cyan-300 sm:text-sm">{number(trained)}</span>
              : <span className="text-xs text-slate-500">—</span>}
          </div>
        </div>
        <div title={`${t('training.nextRange')}: ${number(outcome?.min)}–${number(outcome?.max)} ${stat.label}`} className={`whitespace-nowrap text-right font-mono text-[10px] font-black sm:text-xs ${outcome?.max > 0 ? 'text-cyan-300' : 'text-slate-600'}`}>
          {number(outcome?.min)} ~ {number(outcome?.max)}
        </div>
        <div className="grid w-[126px] grid-cols-[36px_48px_36px] overflow-hidden rounded-lg bg-[#073b63] shadow-sm">
          <HoldStepButton
            direction={-1}
            disabled={value <= 0}
            className="h-9 text-lg font-black text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
            label={t('training.decrease', { stat: stat.label })}
            onStep={(delta) => onStep(stat.key, delta)}
          />
          <input
            type="number"
            min="0"
            max={capacity || 0}
            value={value}
            onChange={(event) => onChange(stat.key, event.target.value)}
            className="training-number-input training-stat-input h-9 min-w-0 bg-indigo-500 px-1 text-center font-mono text-base font-black text-white outline-none"
            aria-label={`${stat.label} training points`}
          />
          <HoldStepButton
            direction={1}
            disabled={value >= capacity}
            className="h-9 text-lg font-black text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
            label={t('training.increase', { stat: stat.label })}
            onStep={(delta) => onStep(stat.key, delta)}
          />
        </div>
      </div>
    );
  };

  return (
    <section className={`${panel} flex flex-col overflow-visible xl:h-full`}>
      {children}
      <div className="flex flex-col items-start gap-2 bg-[#073b63] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2 text-cyan-200">
          <Activity className="h-4 w-4" />
          <h2 className="text-sm font-black uppercase tracking-wider">{t('training.stats')}</h2>
          <InfoTooltip text={t('training.statsHint')} />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 font-mono text-xs font-black text-cyan-100">
            <FatigueSprite fatigue={fatigue} size={20} />
            <span>{fatigue}/100</span>
            <span className="text-cyan-400/40">·</span>
            <span>{summary.remaining} TP {t('training.remaining')}</span>
          </div>

          <div className="flex items-center gap-2">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                title={t('training.resetHint')}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t('training.reset')}</span>
              </button>
            )}

            {onSimulate && (
              <button
                type="button"
                onClick={onSimulate}
                disabled={fatigue >= 100 || summary.remaining <= 0 || !selectedProgram || selectedProgram.available === false}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-black text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>
                  {Number(selectedProgram?.rank) === 100
                    ? (lang === 'vi' ? 'Dùng vật phẩm' : 'Use Consumable')
                    : (lang === 'vi' ? 'Huấn luyện' : 'Train Session')}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-x-6 gap-0 sm:gap-y-2.5 p-1.5 sm:p-4 lg:grid-cols-2">
        <div className="space-y-2.5">{TRAINING_STATS.slice(0, 5).map(renderStat)}</div>
        <div className="space-y-2.5">{TRAINING_STATS.slice(5).map(renderStat)}</div>
      </div>
      {summary.overCapacity > 0 && <div className="mx-5 mb-5 flex gap-2 rounded-lg bg-rose-500/10 p-2 text-[10px] text-rose-300"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{t('training.overCapacity', { points: summary.overCapacity })}</div>}
    </section>
  );
}

function ProgramSummary({ program, target, t }) {
  if (!program) return null;
  return (
    <section className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t('training.selectedProgram')}
          </div>
          <h3 className="text-lg font-black text-white">{program.name}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {t('training.expectedAllocation')} {target.toUpperCase()}:{' '}
            <strong className="text-indigo-300">{number(program.targetShare * 100)}%</strong>
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${program.available ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
          {program.available ? t('training.available') : t('training.fatigueBlocked')}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          [t('training.rank'), program.rank === 100 ? t('training.instant') : program.rank],
          [t('training.duration'), formatDuration(program.duration)],
          [t('training.fatigue'), `+${program.fatigue}`],
          [t('training.guarantee'), program.minGuarantee || '—']
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-950/60 p-2">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-0.5 text-sm font-black text-slate-200">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Distribution({ rows, t }) {
  const active = rows.filter((row) => row.share > 0);
  return (
    <section className={`${panel} p-5`}>
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-cyan-400" />
        <h2 className="text-sm font-black text-slate-100">{t('training.expectedDistribution')}</h2>
      </div>
      {active.length ? <div className="space-y-3">
        {active.map((row) => (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-black text-slate-300">{row.label}</span>
              <span className="font-mono text-slate-400">{number(row.expected)} TP · {number(row.share * 100)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full transition-all" style={{ width: `${row.share * 100}%`, backgroundColor: row.color }} />
            </div>
            <div className="mt-1 text-[10px] text-slate-500">{t('training.estimatedRange')} {number(row.min)}–{number(row.max)} TP</div>
          </div>
        ))}
      </div> : <div className="rounded-lg border border-dashed border-slate-700 py-10 text-center text-xs text-slate-500">
        {t('training.noWeights')}
      </div>}
    </section>
  );
}

function ProgramBrowser({ programs, selectedId, onSelect, lang }) {
  const [search, setSearch] = useState('');
  const [rank, setRank] = useState('all');
  const [focus, setFocus] = useState('all');
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return programs.filter((program) =>
      (rank === 'all' || String(program.rank) === rank)
      && (focus === 'all' || Number(program[focus]) > 0)
      && (!query || program.name.toLowerCase().includes(query) || String(program.id).includes(query))
    );
  }, [focus, programs, rank, search]);

  return (
    <section className={`${panel} overflow-hidden`}>
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-black text-slate-100">{lang === 'vi' ? 'Danh mục chương trình' : 'Training program browser'}</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">{filtered.length} / {programs.length} {lang === 'vi' ? 'chương trình' : 'programs'}</p>
          </div>
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-[220px_130px_130px]">
            <label className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={lang === 'vi' ? 'Tìm chương trình…' : 'Search programs…'} className={`${input} pl-9`} />
            </label>
            <select value={rank} onChange={(event) => setRank(event.target.value)} className={input}>
              <option value="all">{lang === 'vi' ? 'Mọi hạng' : 'All ranks'}</option>
              <option value="1">{lang === 'vi' ? 'Hạng 1' : 'Rank 1'}</option>
              <option value="2">{lang === 'vi' ? 'Hạng 2' : 'Rank 2'}</option>
              <option value="100">{lang === 'vi' ? 'Tức thì' : 'Instant'}</option>
            </select>
            <select value={focus} onChange={(event) => setFocus(event.target.value)} className={input}>
              <option value="all">{lang === 'vi' ? 'Mọi chỉ số' : 'All stats'}</option>
              {TRAINING_STATS.map((stat) => <option key={stat.key} value={stat.key}>{stat.label}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="max-h-[620px] overflow-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-950 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">{lang === 'vi' ? 'Chương trình' : 'Program'}</th>
              <th className="px-3 py-3">{lang === 'vi' ? 'Hạng' : 'Rank'}</th>
              <th className="px-3 py-3">{lang === 'vi' ? 'Thời gian' : 'Duration'}</th>
              <th className="px-3 py-3">{lang === 'vi' ? 'Chi phí' : 'Cost'}</th>
              <th className="px-3 py-3">{lang === 'vi' ? 'Mệt' : 'Fatigue'}</th>
              <th className="px-3 py-3">{lang === 'vi' ? 'Đảm bảo' : 'Min'}</th>
              {TRAINING_STATS.map((stat) => <th key={stat.key} className="px-2 py-3 text-center">{stat.label}</th>)}
              <th className="px-3 py-3">{lang === 'vi' ? 'Yêu cầu' : 'Requires'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((program) => (
              <tr key={program.id} onClick={() => onSelect(program.id)} className={`cursor-pointer transition hover:bg-indigo-500/10 ${program.id === selectedId ? 'bg-indigo-500/15' : ''}`}>
                <td className="px-4 py-3"><div className="font-bold text-slate-200">{program.name}</div><div className="font-mono text-[9px] text-slate-600">#{program.id}</div></td>
                <td className="px-3 py-3 text-slate-400">{program.rank === 100 ? (lang === 'vi' ? 'Tức thì' : 'Instant') : program.rank}</td>
                <td className="px-3 py-3 text-slate-400">{formatDuration(program.duration)}</td>
                <td className="px-3 py-3 font-mono text-slate-400">{program.mineralCost ? `${program.mineralCost.toLocaleString()} M` : program.gasCost ? `${program.gasCost.toLocaleString()} G` : '—'}</td>
                <td className="px-3 py-3 text-slate-400">{program.fatigue || '—'}</td>
                <td className="px-3 py-3 text-slate-400">{program.minGuarantee || '—'}</td>
                {TRAINING_STATS.map((stat) => <td key={stat.key} className="px-2 py-3 text-center font-mono"><span className={program[stat.key] ? 'font-bold text-slate-200' : 'text-slate-700'}>{program[stat.key] || '·'}</span></td>)}
                <td className="px-3 py-3 text-[10px] text-slate-500">{program.prereq ? `T#${program.prereq}` : ''}{program.prereq && program.reqResearch ? ' · ' : ''}{program.reqResearch ? `R#${program.reqResearch}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function TrainingTool() {
  const { t, lang } = useTranslation();
  const [crew, setCrew] = useState([]);
  const [instantItems, setInstantItems] = useState([]);
  const [apiPrograms, setApiPrograms] = useState(fallbackTrainingPrograms);
  const [programSource, setProgramSource] = useState('fallback');
  const [crewId, setCrewId] = useState('');
  const [target, setTarget] = useState('abl');
  const [training, setTraining] = useState({ ...EMPTY_TRAINING });
  const [fatigue, setFatigue] = useState(0);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJson = (path) => fetch(publicUrl(path)).then((response) => {
      if (!response.ok) throw new Error(`${path} request failed (${response.status})`);
      return response.json();
    });

    Promise.all([
      fetchJson('/data/active/crew.json'),
      fetchJson('/data/active/items.json'),
      fetchJson('/data/active/training.json').catch((error) => {
        console.warn('Using bundled training-design fallback:', error);
        return null;
      })
    ])
      .then(([crewData, itemData, trainingData]) => {
        const sorted = [...crewData].sort((a, b) => a.name.localeCompare(b.name));
        setCrew(sorted);
        setInstantItems(itemData.filter((item) => item.itemSubType === 'InstantTraining' && item.raw?.TrainingDesignId));
        if (Array.isArray(trainingData) && trainingData.length > 0) {
          setApiPrograms(trainingData);
          setProgramSource('snapshot');
        }
        setCrewId(String((sorted.find((item) => item.name === 'Silver Paladin') || sorted[0])?.id ?? ''));
      })
      .catch((error) => console.error('Failed to load crew for training tool:', error))
      .finally(() => setLoading(false));
  }, []);

  const selectedCrew = crew.find((item) => String(item.id) === String(crewId));
  const programs = useMemo(() => {
    const itemsByTrainingId = new Map();
    instantItems.forEach((item) => {
      const trainingId = Number(item.raw.TrainingDesignId);
      // Some event items reuse a training design. The first entry is the
      // canonical consumable (for example, Super Protein Shake for HP tier 4).
      if (!itemsByTrainingId.has(trainingId)) itemsByTrainingId.set(trainingId, item);
    });
    return apiPrograms.map((program) => {
      const item = itemsByTrainingId.get(Number(program.id));
      return item ? {
        ...program,
        name: item.name,
        spriteId: item.imageSpriteId || item.logoSpriteId || program.spriteId,
        itemId: item.id,
        itemRarity: item.rarity
      } : program;
    });
  }, [apiPrograms, instantItems]);
  const capacity = getTrainingCapacity(selectedCrew);
  const summary = summarizeTraining(training, capacity);
  const recommendations = useMemo(() => recommendPrograms(programs, target, 'regular', fatigue), [fatigue, programs, target]);
  const recommended = recommendations[0];
  const selectedBase = programs.find((item) => item.id === selectedProgramId);
  const selected = selectedBase
    ? recommendPrograms([selectedBase], target, 'regular', fatigue)[0] || {
      ...selectedBase,
      targetShare: 0,
      available: Number(fatigue) + (Number(selectedBase.fatigue) || 0) <= 100
    }
    : recommended;
  const distribution = calculateTrainingPossibilities(selected, capacity, training, fatigue, target, 'regular');
  const maxTargetPoints = distribution.find((row) => row.key === target)?.max || 0;

  const handleSimulate = () => {
    if (!selected || fatigue >= 100 || summary.remaining <= 0 || selected.available === false) return;

    const addedFatigue = Number(selected.fatigue) || 0;
    const newFatigue = Math.min(fatigue + addedFatigue, 100);

    const newTraining = { ...training };
    let remainingCapacity = summary.remaining;
    distribution.forEach((row) => {
      if (remainingCapacity <= 0) return;
      const minVal = Math.max(0, Math.floor(row.min ?? 0));
      const maxVal = Math.min(
        remainingCapacity,
        Math.max(minVal, Math.floor(row.max ?? row.expected ?? 0))
      );

      let gain = 0;
      if (maxVal > minVal) {
        // Roll random integer gain in range [minVal, maxVal] inclusive
        gain = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      } else {
        gain = maxVal;
      }

      if (gain > 0) {
        newTraining[row.key] = clampTrainingValue((newTraining[row.key] || 0) + gain, capacity);
        remainingCapacity -= gain;
      }
    });

    setTraining(newTraining);
    setFatigue(newFatigue);
  };

  const reset = () => {
    setTraining({ ...EMPTY_TRAINING });
    setFatigue(0);
    setTarget('abl');
    setSelectedProgramId(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-3 pb-8 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:pb-0">
      <SEOHead title={t('training.seoTitle')} description={t('training.seoDescription')} />

      <header className="page-header shrink-0">
        <div>
          <h1 className="page-title ">{t('training.pageTitle')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('training.pageDescription')}</p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
            programSource === 'snapshot'
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-amber-500/10 text-amber-300'
          }`}
          title={programSource === 'snapshot' ? t('training.snapshotSourceHint') : t('training.fallbackSourceHint')}
        >
          {programSource === 'snapshot' ? t('training.snapshotSource') : t('training.fallbackSource')} · {programs.length}
        </div>
      </header>

      <div className="grid gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <CrewStage
          crew={crew}
          crewId={crewId}
          selectedCrew={selectedCrew}
          capacity={capacity}
          summary={summary}
          fatigue={fatigue}
          loading={loading}
          onCrewChange={(value) => {
            setCrewId(value);
            setTraining({ ...EMPTY_TRAINING });
          }}
          onFatigueChange={setFatigue}
          t={t}
        />

        <main className="min-h-0">
          <div className="xl:h-full">
            <TrainingStats
              selectedCrew={selectedCrew}
              training={training}
              capacity={capacity}
              summary={summary}
              distribution={distribution}
              fatigue={fatigue}
              selectedProgram={selected}
              onSimulate={handleSimulate}
              onReset={reset}
              lang={lang}
              onChange={(key, value) => setTraining((current) => ({ ...current, [key]: clampTrainingValue(value, capacity) }))}
              onStep={(key, delta) => setTraining((current) => ({
                ...current,
                [key]: clampTrainingValue(current[key] + delta, capacity)
              }))}
              t={t}
            >
              <ProgramSelector
                embedded
                programs={programs}
                selectedId={selectedProgramId}
                selected={selected}
                target={target}
                maxTargetPoints={maxTargetPoints}
                onSelect={setSelectedProgramId}
                onTargetChange={(value) => {
                  setTarget(value);
                  setSelectedProgramId(null);
                }}
                t={t}
              />
            </TrainingStats>
          </div>
        </main>
      </div>

      {false && <div>
        <aside className="space-y-6">
          <section className={`${panel} p-5`}>
            <div className="mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-indigo-400" /><h2 className="text-sm font-black text-slate-100">{lang === 'vi' ? 'Thiết lập mục tiêu' : 'Training setup'}</h2></div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === 'vi' ? 'Crew' : 'Crew member'}</span>
                <div className="relative">
                  <select disabled={loading} value={crewId} onChange={(event) => { setCrewId(event.target.value); setTraining({ ...EMPTY_TRAINING }); }} className={`${input} appearance-none pr-9`}>
                    {loading && <option>{lang === 'vi' ? 'Đang tải…' : 'Loading…'}</option>}
                    {crew.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.rarity}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                </div>
              </label>
              {selectedCrew && <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <img src={publicUrl(`/assets/sprites/${selectedCrew.profileSpriteId}.webp`)} alt="" className="h-12 w-12 object-contain [image-rendering:pixelated]" />
                <div className="min-w-0"><div className="truncate text-sm font-black text-slate-200">{selectedCrew.name}</div><div className="text-[10px] uppercase tracking-wider text-slate-500">{selectedCrew.rarity} · {capacity} TP</div></div>
              </div>}
              {selectedCrew && <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === 'vi' ? 'Chỉ số crew cấp tối đa' : 'Max-level base stats'}</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {TRAINING_STATS.map((stat) => <div key={stat.key} className="rounded-md bg-slate-950 px-2 py-1.5 text-center">
                    <div className="text-[9px] font-black" style={{ color: stat.color }}>{stat.label}</div>
                    <div className="font-mono text-xs font-bold text-slate-300">{stat.crewKey && selectedCrew[stat.crewKey] != null ? number(selectedCrew[stat.crewKey]) : '—'}</div>
                  </div>)}
                </div>
              </div>}
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === 'vi' ? 'Chỉ số mục tiêu' : 'Target stat'}</span>
                <div className="grid grid-cols-3 gap-1.5">{TRAINING_STATS.map((stat) => <button key={stat.key} onClick={() => setTarget(stat.key)} className={`rounded-lg border px-2 py-2 text-xs font-black transition ${target === stat.key ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}>{stat.label}</button>)}</div>
              </div>
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang === 'vi' ? 'Chất lượng' : 'Training quality'}</span>
                <div className="grid grid-cols-2 rounded-lg bg-slate-950 p-1">{['regular', 'elite'].map((item) => <button key={item} onClick={() => setQuality(item)} className={`rounded-md px-3 py-2 text-xs font-black transition ${quality === item ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{item === 'regular' ? (lang === 'vi' ? 'Thường' : 'Regular') : 'Elite'}</button>)}</div>
              </div>
              <label className="block">
                <span className="mb-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>{lang === 'vi' ? 'Mệt mỏi hiện tại' : 'Current fatigue'}</span><span>{fatigue}/100</span></span>
                <input type="range" min="0" max="100" value={fatigue} onChange={(event) => setFatigue(Number(event.target.value))} className="w-full accent-indigo-500" />
              </label>
            </div>
          </section>

          <section className={`${panel} p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><BatteryCharging className="h-4 w-4 text-emerald-400" /><h2 className="text-sm font-black text-slate-100">{lang === 'vi' ? 'Điểm đã dùng' : 'Current training'}</h2></div>
              <span className={`font-mono text-xs font-bold ${summary.overCapacity ? 'text-rose-400' : 'text-slate-400'}`}>{summary.spent}/{capacity}</span>
            </div>
            <div className="space-y-2">{TRAINING_STATS.map((stat) => <label key={stat.key} className="grid grid-cols-[38px_1fr_62px] items-center gap-2">
              <span className="text-xs font-black" style={{ color: stat.color }}>{stat.label}</span>
              <input type="range" min="0" max={capacity || 0} value={training[stat.key]} onChange={(event) => setTraining((current) => ({ ...current, [stat.key]: clampTrainingValue(event.target.value, capacity) }))} className="w-full accent-indigo-500" />
              <input type="number" min="0" max={capacity || 0} value={training[stat.key]} onChange={(event) => setTraining((current) => ({ ...current, [stat.key]: clampTrainingValue(event.target.value, capacity) }))} className={`${input} px-2 py-1.5 text-right font-mono text-xs`} />
            </label>)}</div>
            {summary.overCapacity > 0 && <div className="mt-3 flex gap-2 rounded-lg bg-rose-500/10 p-2 text-[10px] text-rose-300"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{lang === 'vi' ? `Vượt dung lượng ${summary.overCapacity} TP.` : `${summary.overCapacity} TP over capacity.`}</div>}
          </section>
        </aside>

        <main className="space-y-6">
          <section className="grid gap-3 sm:grid-cols-3">
            {[
              [Activity, lang === 'vi' ? 'Còn lại' : 'Remaining TP', summary.remaining, 'text-emerald-400'],
              [Dumbbell, lang === 'vi' ? 'Đã phân bổ' : 'Allocated TP', summary.spent, 'text-indigo-400'],
              [Clock3, lang === 'vi' ? 'Mức mệt còn trống' : 'Fatigue room', Math.max(100 - fatigue, 0), 'text-amber-400']
            ].map(([Icon, label, value, color]) => <div key={label} className={`${panel} flex items-center gap-3 p-4`}><div className="rounded-lg bg-slate-950 p-2"><Icon className={`h-4 w-4 ${color}`} /></div><div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div><div className="text-xl font-black text-slate-100">{value}</div></div></div>)}
          </section>
          <ProgramSummary program={selected} target={target} lang={lang} />
          <Distribution rows={distribution} lang={lang} />
          <section className={`${panel} p-5`}>
            <div className="mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-fuchsia-400" /><h2 className="text-sm font-black text-slate-100">{lang === 'vi' ? 'Cải thiện có thể đạt' : 'Possible improvement'}</h2></div>
            <div className="grid gap-2 sm:grid-cols-3">{distribution.map((row) => <div key={row.key} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex items-center justify-between"><span className="text-xs font-black" style={{ color: row.color }}>{row.label}</span><span className="font-mono text-[10px] text-slate-500">{number(row.share * 100)}%</span></div><div className="mt-1 text-sm font-black text-slate-200">+{number(row.min)}–{number(row.max)} TP</div></div>)}</div>
            <p className="mt-4 text-[10px] leading-relaxed text-slate-500">{lang === 'vi' ? 'Mô hình ước tính dùng trọng số cơ hội, độ biến thiên và mức đảm bảo từ dữ liệu game. Elite áp dụng độ lệch mục tiêu 1,25× vì hệ số chính xác chưa được công bố.' : 'Estimate based on game chance weights, variability, and minimum guarantee. Elite applies a 1.25× target bias while its exact authoritative multiplier remains unpublished.'}</p>
          </section>
        </main>
      </div>}

    </div>
  );
}

export default TrainingTool;
