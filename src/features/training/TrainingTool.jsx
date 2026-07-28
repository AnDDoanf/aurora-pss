import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, BatteryCharging, BookOpen, ChevronDown,
  Clock3, Dumbbell, RotateCcw, Search, Sparkles, Target
} from 'lucide-react';
import trainingPrograms from '../../../training_designs_parsed.json';
import { SEOHead } from '../../components/SEOHead';
import { useTranslation } from '../../i18n/useTranslation';
import { publicUrl } from '../../utils/publicUrl';
import {
  EMPTY_TRAINING, TRAINING_STATS, clampTrainingValue,
  calculateTrainingPossibilities, formatDuration, getTrainingCapacity,
  isPrimaryTrainingStat, recommendPrograms, summarizeTraining
} from './trainingCalculations';

const panel = 'rounded-xl border border-slate-800 bg-slate-900 shadow-sm';
const input = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';
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

function CrewStage({ crew, crewId, selectedCrew, capacity, summary, fatigue, loading, onCrewChange, onFatigueChange, lang }) {
  const state = getFatigueState(fatigue);
  const usedPercent = capacity ? Math.min((summary.spent / capacity) * 100, 100) : 0;
  const fatiguePercent = Math.min(Math.max(fatigue, 0), 100);

  return (
    <section className={`${panel} flex min-h-[590px] flex-col overflow-hidden`}>
      <div className="border-b border-cyan-500/30 bg-[#073b63] px-4 py-3">
        <div className="block">
          <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">{lang === 'vi' ? 'Chọn crew' : 'Crew details'}</span>
          <div className="relative">
            <select disabled={loading} value={crewId} onChange={(event) => onCrewChange(event.target.value)} className={`${input} appearance-none border-cyan-500/30 bg-[#082f4d] pr-9 font-bold`}>
              {loading && <option>{lang === 'vi' ? 'Đang tải…' : 'Loading…'}</option>}
              {crew.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.rarity}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-cyan-300" />
          </div>
        </div>
      </div>

      <div className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${state.glow} via-[#082f4d] to-[#061f35] px-5 py-8`}>
        <div className="absolute inset-x-8 top-1/2 h-px bg-cyan-300/25" />
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 backdrop-blur">
          <FatigueSprite fatigue={fatigue} size={28} />
          <div className="text-[9px] font-bold text-slate-400">{fatigue}/100</div>
        </div>

        {selectedCrew && <>
          <div className="relative z-10 flex h-56 w-56 items-center justify-center">
            <div className="absolute inset-3 rounded-full bg-cyan-400/10 blur-2xl" />
            <img
              src={publicUrl(`/assets/sprites/${selectedCrew.profileSpriteId}.webp`)}
              alt={selectedCrew.name}
              className={`relative max-h-full max-w-full scale-[1.65] object-contain [image-rendering:pixelated] transition-all duration-300 ${fatigue >= 90 ? 'grayscale contrast-75' : fatigue >= 65 ? 'saturate-50' : ''}`}
            />
          </div>
          <div className="relative z-10 mt-5 text-center">
            <h2 className="text-xl font-black text-yellow-300">{selectedCrew.name}</h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/70">{selectedCrew.rarity} · Lv. {selectedCrew.maxLevel}</p>
          </div>
        </>}
      </div>

      <div className="space-y-4 border-t border-cyan-500/30 bg-[#073b63] p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-black text-cyan-100">
            <span>{lang === 'vi' ? 'Huấn luyện' : 'Training'}</span>
            <span className="font-mono">{summary.spent}/{capacity}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-sm border border-cyan-300/20 bg-[#041e31] p-0.5">
            <div className={`h-full transition-all ${summary.overCapacity ? 'bg-rose-500' : 'bg-yellow-400'}`} style={{ width: `${usedPercent}%` }} />
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-wider text-cyan-200/70">
            <span>{lang === 'vi' ? 'Mệt mỏi' : 'Fatigue'}</span>
            <span className={`flex items-center gap-1.5 ${state.color}`}><FatigueSprite fatigue={fatigue} size={18} />{fatigue}/100</span>
          </span>
          <div className="relative">
            <input type="range" min="0" max="100" value={fatigue} onChange={(event) => onFatigueChange(Number(event.target.value))} className="relative z-10 w-full accent-cyan-400" />
            <div className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-orange-400/30" style={{ width: `${fatiguePercent}%` }} />
          </div>
        </label>
      </div>
    </section>
  );
}

function ProgramSelector({ programs, selectedId, selected, target, quality, onSelect, onTargetChange, onQualityChange, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const targetPrograms = programs.filter((program) => isPrimaryTrainingStat(program, target));
  const repeatable = targetPrograms.filter((program) => Number(program.rank) !== 100);
  const consumables = targetPrograms.filter((program) => Number(program.rank) === 100);

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
      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-cyan-500/15 ${
        program.id === selected?.id ? 'bg-blue-600 text-white' : 'text-cyan-50'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-cyan-400/40 bg-slate-950/70">
        <img src={publicUrl(`/assets/sprites/${program.spriteId}.webp`)} alt="" className="h-8 w-8 object-contain [image-rendering:pixelated]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold">{program.name}</span>
        <span className={`block text-[10px] ${program.id === selected?.id ? 'text-blue-100' : 'text-cyan-300/60'}`}>
          {Number(program.rank) === 100
            ? (lang === 'vi' ? 'Dùng ngay' : 'Instant consumable')
            : `${formatDuration(program.duration)} · +${program.fatigue} fatigue`}
        </span>
      </span>
    </button>
  );

  return (
    <section className={`${panel} relative z-30 overflow-visible`}>
      <div className="border-b border-cyan-500/30 bg-[#073b63] px-5 py-3">
        <div className="flex items-center gap-2 text-cyan-200">
          <Dumbbell className="h-4 w-4" />
          <h2 className="text-sm font-black uppercase tracking-wider">{lang === 'vi' ? 'Trạm huấn luyện' : 'Training station'}</h2>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{lang === 'vi' ? 'Chương trình hoặc vật phẩm' : 'Training or consumable'}</span>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className={`${input} flex min-h-14 items-center gap-3 border-cyan-500/40 bg-[#082f4d] py-2 pr-10 text-left`}
            >
              {selected && <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-cyan-400/40 bg-slate-950/70">
                <img src={publicUrl(`/assets/sprites/${selected.spriteId}.webp`)} alt="" className="h-9 w-9 object-contain [image-rendering:pixelated]" />
              </span>}
              <span className="min-w-0">
                <span className="block truncate text-base font-black text-cyan-100">{selected?.name || (lang === 'vi' ? 'Chọn chương trình' : 'Select a program')}</span>
                {selected && <span className="block text-[10px] text-cyan-300/60">
                  {Number(selected.rank) === 100 ? (lang === 'vi' ? 'Dùng ngay' : 'Instant consumable') : `${formatDuration(selected.duration)} · +${selected.fatigue} fatigue`}
                </span>}
              </span>
            </button>
            <ChevronDown className={`pointer-events-none absolute right-3 top-5 h-5 w-5 text-cyan-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            {isOpen && (
              <div role="listbox" className="absolute z-50 mt-1 max-h-[430px] w-full overflow-y-auto border border-cyan-400/60 bg-[#082f4d] shadow-2xl">
                {repeatable.length > 0 && <>
                  <div className="sticky top-0 z-10 bg-[#061f35] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                    {lang === 'vi' ? 'Chương trình huấn luyện' : 'Training programs'}
                  </div>
                  {repeatable.map(renderOption)}
                </>}
                {consumables.length > 0 && <>
                  <div className="sticky top-0 z-10 border-t border-cyan-400/30 bg-[#061f35] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                    {lang === 'vi' ? 'Vật phẩm dùng ngay' : 'Instant consumables'}
                  </div>
                  {consumables.map(renderOption)}
                </>}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">{lang === 'vi' ? 'Chỉ số mục tiêu' : 'Target stat'}</span>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-9">
              {TRAINING_STATS.map((stat) => <button key={stat.key} onClick={() => onTargetChange(stat.key)} className={`rounded-md border px-2 py-2 text-xs font-black transition ${target === stat.key ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}>{stat.label}</button>)}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">{lang === 'vi' ? 'Chất lượng' : 'Quality'}</span>
            <div className="grid grid-cols-2 rounded-lg bg-slate-950 p-1">
              {['regular', 'elite'].map((item) => <button key={item} onClick={() => onQualityChange(item)} className={`rounded-md px-3 py-2 text-xs font-black transition ${quality === item ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{item === 'regular' ? (lang === 'vi' ? 'Thường' : 'Regular') : 'Elite'}</button>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrainingStats({ selectedCrew, training, capacity, summary, distribution, fatigue, onChange, lang }) {
  const renderStat = (stat) => {
    const outcome = distribution.find((row) => row.key === stat.key);
    const base = stat.crewKey ? selectedCrew?.[stat.crewKey] : null;
    const value = training[stat.key];
    return (
      <div key={stat.key} className="grid grid-cols-[34px_54px_minmax(58px,1fr)_120px] items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center border border-cyan-400/70 bg-[#07517b]">
          <img src={publicUrl(`/assets/sprites/${stat.spriteId}.webp`)} alt="" className="h-7 w-7 object-contain [image-rendering:pixelated]" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-black leading-none" style={{ color: stat.color }}>{stat.label}</div>
          <div className="mt-1 truncate text-[9px] text-slate-500">{lang === 'vi' ? 'Gốc' : 'Base'} {base != null ? number(base) : '—'}</div>
        </div>
        <div className={`whitespace-nowrap text-right font-mono text-xs font-black ${outcome?.max > 0 ? 'text-cyan-300' : 'text-slate-600'}`}>
          {number(outcome?.min)} ~ {number(outcome?.max)}
        </div>
        <div className="grid grid-cols-[36px_48px_36px] overflow-hidden border-2 border-cyan-400/60 bg-[#073b63] shadow-[inset_0_0_0_1px_rgba(2,20,35,0.8)]">
          <button
            type="button"
            onClick={() => onChange(stat.key, value - 1)}
            disabled={value <= 0}
            className="h-9 border-r border-cyan-400/30 text-lg font-black text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Decrease ${stat.label}`}
          >
            −
          </button>
          <input
            type="number"
            min="0"
            max={capacity || 0}
            value={value}
            onChange={(event) => onChange(stat.key, event.target.value)}
            className="h-9 min-w-0 bg-[#258de2] px-1 text-center font-mono text-base font-black text-white outline-none focus:bg-[#38a4fa]"
            aria-label={`${stat.label} training points`}
          />
          <button
            type="button"
            onClick={() => onChange(stat.key, value + 1)}
            disabled={value >= capacity}
            className="h-9 border-l border-cyan-400/30 text-lg font-black text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Increase ${stat.label}`}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className={`${panel} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-cyan-500/30 bg-[#073b63] px-5 py-3">
        <div className="flex items-center gap-2 text-cyan-200"><Activity className="h-4 w-4" /><h2 className="text-sm font-black uppercase tracking-wider">{lang === 'vi' ? 'Chỉ số huấn luyện' : 'Training stats'}</h2></div>
        <div className="flex items-center gap-2 font-mono text-xs font-black text-cyan-100">
          <FatigueSprite fatigue={fatigue} size={20} />
          <span>{fatigue}/100</span>
          <span className="text-cyan-400/40">·</span>
          <span>{summary.remaining} TP {lang === 'vi' ? 'còn lại' : 'remaining'}</span>
        </div>
      </div>
      <div className="grid gap-x-8 gap-y-3 p-5 lg:grid-cols-2">
        <div className="space-y-2.5">{TRAINING_STATS.slice(0, 5).map(renderStat)}</div>
        <div className="space-y-2.5">{TRAINING_STATS.slice(5).map(renderStat)}</div>
      </div>
      {summary.overCapacity > 0 && <div className="mx-5 mb-5 flex gap-2 rounded-lg bg-rose-500/10 p-2 text-[10px] text-rose-300"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{lang === 'vi' ? `Vượt dung lượng ${summary.overCapacity} TP.` : `${summary.overCapacity} TP over capacity.`}</div>}
    </section>
  );
}

function ProgramSummary({ program, target, lang }) {
  if (!program) return null;
  return (
    <section className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            {lang === 'vi' ? 'Chương trình đang chọn' : 'Selected program'}
          </div>
          <h3 className="text-lg font-black text-white">{program.name}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {lang === 'vi' ? 'Tỷ lệ dự kiến vào' : 'Expected allocation to'} {target.toUpperCase()}:{' '}
            <strong className="text-indigo-300">{number(program.targetShare * 100)}%</strong>
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${program.available ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
          {program.available ? (lang === 'vi' ? 'Có thể dùng' : 'Available') : (lang === 'vi' ? 'Quá mệt' : 'Fatigue blocked')}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          [lang === 'vi' ? 'Hạng' : 'Rank', program.rank === 100 ? (lang === 'vi' ? 'Tức thì' : 'Instant') : program.rank],
          [lang === 'vi' ? 'Thời gian' : 'Duration', formatDuration(program.duration)],
          [lang === 'vi' ? 'Mệt mỏi' : 'Fatigue', `+${program.fatigue}`],
          [lang === 'vi' ? 'Đảm bảo' : 'Guarantee', program.minGuarantee || '—']
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

function Distribution({ rows, lang }) {
  const active = rows.filter((row) => row.share > 0);
  return (
    <section className={`${panel} p-5`}>
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-cyan-400" />
        <h2 className="text-sm font-black text-slate-100">{lang === 'vi' ? 'Phân bổ dự kiến' : 'Expected distribution'}</h2>
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
            <div className="mt-1 text-[10px] text-slate-500">{lang === 'vi' ? 'Khoảng ước tính' : 'Estimated range'} {number(row.min)}–{number(row.max)} TP</div>
          </div>
        ))}
      </div> : <div className="rounded-lg border border-dashed border-slate-700 py-10 text-center text-xs text-slate-500">
        {lang === 'vi' ? 'Không có trọng số huấn luyện.' : 'No training weights available.'}
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
      <div className="border-b border-slate-800 p-5">
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
          <tbody className="divide-y divide-slate-800/80">
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
  const { lang } = useTranslation();
  const [crew, setCrew] = useState([]);
  const [instantItems, setInstantItems] = useState([]);
  const [crewId, setCrewId] = useState('');
  const [target, setTarget] = useState('abl');
  const [quality, setQuality] = useState('regular');
  const [training, setTraining] = useState({ ...EMPTY_TRAINING });
  const [fatigue, setFatigue] = useState(0);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/active/crew.json').then((response) => {
        if (!response.ok) throw new Error(`Crew request failed (${response.status})`);
        return response.json();
      }),
      fetch('/data/active/items.json').then((response) => {
        if (!response.ok) throw new Error(`Items request failed (${response.status})`);
        return response.json();
      })
    ])
      .then(([crewData, itemData]) => {
        const sorted = [...crewData].sort((a, b) => a.name.localeCompare(b.name));
        setCrew(sorted);
        setInstantItems(itemData.filter((item) => item.itemSubType === 'InstantTraining' && item.raw?.TrainingDesignId));
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
    return trainingPrograms.map((program) => {
      const item = itemsByTrainingId.get(Number(program.id));
      return item ? {
        ...program,
        name: item.name,
        spriteId: item.imageSpriteId || item.logoSpriteId || program.spriteId,
        itemId: item.id,
        itemRarity: item.rarity
      } : program;
    });
  }, [instantItems]);
  const capacity = getTrainingCapacity(selectedCrew);
  const summary = summarizeTraining(training, capacity);
  const recommendations = useMemo(() => recommendPrograms(programs, target, quality, fatigue), [fatigue, programs, quality, target]);
  const recommended = recommendations[0];
  const selectedBase = programs.find((item) => item.id === selectedProgramId);
  const selected = selectedBase
    ? recommendPrograms([selectedBase], target, quality, fatigue)[0] || {
        ...selectedBase,
        targetShare: 0,
        available: Number(fatigue) + (Number(selectedBase.fatigue) || 0) <= 100
      }
    : recommended;
  const distribution = calculateTrainingPossibilities(selected, capacity, training, fatigue, target, quality);

  const reset = () => {
    setTraining({ ...EMPTY_TRAINING });
    setFatigue(0);
    setTarget('abl');
    setQuality('regular');
    setSelectedProgramId(null);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-12">
      <SEOHead title={lang === 'vi' ? 'Công cụ Huấn luyện Crew | Pixel Starships' : 'Crew Training Calculator | Pixel Starships'} description={lang === 'vi' ? 'Tính điểm huấn luyện và tìm chương trình tối ưu cho crew.' : 'Plan crew training points and compare every PSS training program.'} />

      <header className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-md">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-16 translate-x-16 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400"><Dumbbell className="h-4 w-4" />{lang === 'vi' ? 'Công cụ lập kế hoạch' : 'Planning tool'}</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">{lang === 'vi' ? 'Huấn luyện Crew' : 'Crew Training Calculator'}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{lang === 'vi' ? 'Phân bổ dung lượng huấn luyện, so sánh kết quả và tìm chương trình tốt nhất cho chỉ số mục tiêu.' : 'Allocate training capacity, compare possible outcomes, and find the strongest program for your target stat.'}</p>
          </div>
          <button onClick={reset} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-700"><RotateCcw className="h-3.5 w-3.5" />{lang === 'vi' ? 'Đặt lại' : 'Reset'}</button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
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
          lang={lang}
        />

        <main className="space-y-5">
          <ProgramSelector
            programs={programs}
            selectedId={selectedProgramId}
            selected={selected}
            target={target}
            quality={quality}
            onSelect={setSelectedProgramId}
            onTargetChange={(value) => {
              setTarget(value);
              setSelectedProgramId(null);
            }}
            onQualityChange={setQuality}
            lang={lang}
          />

          <div className="grid gap-5 2xl:grid-cols-[minmax(300px,0.8fr)_minmax(420px,1.2fr)]">
            <div className="space-y-5">
              <ProgramSummary program={selected} target={target} lang={lang} />
              <Distribution rows={distribution} lang={lang} />
              <section className="grid gap-2 sm:grid-cols-3">
                {[
                  [Activity, lang === 'vi' ? 'Còn lại' : 'Remaining TP', summary.remaining, 'text-emerald-400'],
                  [Dumbbell, lang === 'vi' ? 'Đã dùng' : 'Allocated TP', summary.spent, 'text-cyan-400'],
                  [Clock3, lang === 'vi' ? 'Mức mệt trống' : 'Fatigue room', Math.max(100 - fatigue, 0), 'text-amber-400']
                ].map(([Icon, label, value, color]) => (
                  <div key={label} className={`${panel} flex items-center gap-3 p-3`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                    <div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</div><div className="text-lg font-black text-slate-100">{value}</div></div>
                  </div>
                ))}
              </section>
            </div>

            <TrainingStats
              selectedCrew={selectedCrew}
              training={training}
              capacity={capacity}
              summary={summary}
              distribution={distribution}
              fatigue={fatigue}
              onChange={(key, value) => setTraining((current) => ({ ...current, [key]: clampTrainingValue(value, capacity) }))}
              lang={lang}
            />
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
