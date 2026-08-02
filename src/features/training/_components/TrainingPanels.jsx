import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ChevronDown, Dumbbell, Info, RotateCcw
} from 'lucide-react';
import { SpriteFrame } from '../../../components/ui/SpriteFrame';
import { publicUrl } from '../../../utils/publicUrl';
import { getCrewHeadSpriteId } from '../../../utils/crewSprites';
import {
  TRAINING_STATS, calculateTrainedStat, formatDuration, getCrisprTrainingBonus,
  isPrimaryTrainingStat
} from '../trainingCalculations';

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

export function CrewStage({ crew, crewId, selectedCrew, capacity, crisprCount, summary, fatigue, loading, onCrewChange, onCrisprChange, onFatigueChange, t }) {
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
            <SpriteFrame
              spriteId={selectedCrew.profileSpriteId}
              fallbackSpriteId={getCrewHeadSpriteId(selectedCrew)}
              alt={selectedCrew.name}
              size="full"
              borderless
              className={`relative max-h-full max-w-full scale-[1.65] transition-all duration-300 ${fatigue >= 90 ? 'grayscale contrast-75' : fatigue >= 65 ? 'saturate-50' : ''}`}
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-cyan-200/70">{t('training.crispr')}</div>
            <div className="font-mono text-[9px] text-cyan-300/60">
              {t('training.crisprBonus', { bonus: getCrisprTrainingBonus(crisprCount) })}
            </div>
          </div>
          <div className="grid grid-cols-3 rounded-lg bg-[#041e31] p-0.5">
            {[0, 1, 2].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onCrisprChange(count)}
                title={t('training.crisprUses', { count })}
                className={`min-h-8 min-w-9 rounded-md px-2 text-xs font-black transition ${
                  crisprCount === count
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-cyan-200/60 hover:bg-cyan-400/10 hover:text-cyan-100'
                }`}
              >
                {count}
              </button>
            ))}
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

export function ProgramSelector({ programs, selectedId, selected, target, maxTargetPoints, onSelect, onTargetChange, t, embedded = false }) {
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

export function TrainingStats({ selectedCrew, training, capacity, summary, distribution, fatigue, selectedProgram, onSimulate, onReset, lang, onChange, onStep, t, children }) {
  const renderStat = (stat) => {
    const outcome = distribution.find((row) => row.key === stat.key);
    const base = stat.crewKey ? selectedCrew?.[stat.crewKey] : null;
    const value = training[stat.key];
    const trained = calculateTrainedStat(base, value, stat.key);
    const isDirectTrainingStat = stat.key === 'sta';
    const hasCalculatedValue = isDirectTrainingStat || base != null;
    return (
      <div key={stat.key} title={isDirectTrainingStat ? `${stat.label}: ${value} TP = ${number(trained)}` : base != null ? `${stat.label}: ${number(base)} base × (1 + ${value}%) = ${number(trained)}` : `${stat.label} has no base stat available.`} className="grid w-full min-w-0 grid-cols-[28px_max-content_minmax(30px,1fr)_120px] items-center gap-1 sm:grid-cols-[34px_96px_minmax(38px,1fr)_120px] sm:gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#07517b] sm:h-8 sm:w-8">
          <img src={publicUrl(`/assets/sprites/${stat.spriteId}.webp`)} alt="" className="h-6 w-6 object-contain [image-rendering:pixelated] sm:h-7 sm:w-7" />
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className="text-sm font-black leading-none sm:text-base" style={{ color: stat.color }}>{stat.label}</div>
          <div className="mt-0.5 flex min-w-0 items-baseline whitespace-nowrap">
            {hasCalculatedValue
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
