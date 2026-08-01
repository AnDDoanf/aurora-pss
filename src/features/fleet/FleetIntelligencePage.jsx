import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRightLeft, Search, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import {
  getAllianceDataFromCollection,
  getCollectionAlliances,
  getFleetHistory,
  getFleetSnapshotAt,
  getLatestFleetSnapshots
} from '../../services/fleetDataApi';
import { compareFleetMembers } from './fleetSnapshotComparison';
import { PlayerDetailModal } from '../player/PlayerDetailModal';

const UTC_HOURS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
const METRICS = {
  stars: { color: '#f59e0b', labelKey: 'fleetStars' },
  trophy: { color: '#6366f1', labelKey: 'fleetTrophies' },
  memberCount: { color: '#22c55e', labelKey: 'members' },
  totalMemberStars: { color: '#06b6d4', labelKey: 'memberStars' }
};

function HistoryChart({ points, metric, t, lang }) {
  if (!points.length) return null;
  const width = 960;
  const height = 300;
  const margin = { top: 20, right: 24, bottom: 48, left: 76 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const values = points.map((point) => Number(point[metric]) || 0);
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const range = max - min || 1;
  const x = (index) => margin.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
  const y = (value) => margin.top + plotHeight - ((value - min) / range) * plotHeight;
  const line = points.map((point, index) => `${x(index)},${y(Number(point[metric]) || 0)}`).join(' ');
  const labelStep = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px] w-full" role="img" aria-label={t('pages.fleet.historyChart')}>
        {Array.from({ length: 5 }, (_, index) => {
          const value = min + (range / 4) * index;
          const position = y(value);
          return (
            <g key={index}>
              <line x1={margin.left} x2={width - margin.right} y1={position} y2={position} stroke="#64748b" strokeOpacity="0.18" />
              <text x={margin.left - 10} y={position + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                {Math.round(value).toLocaleString()}
              </text>
            </g>
          );
        })}
        <polyline points={line} fill="none" stroke={METRICS[metric].color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point, index) => (
          <g key={`${point.timestamp}-${index}`}>
            <circle cx={x(index)} cy={y(Number(point[metric]) || 0)} r="3.5" fill={METRICS[metric].color}>
              <title>{`${new Date(point.timestamp).toLocaleDateString(lang, { timeZone: 'UTC' })}: ${(Number(point[metric]) || 0).toLocaleString()}`}</title>
            </circle>
            {(index % labelStep === 0 || index === points.length - 1) && (
              <text x={x(index)} y={height - 18} textAnchor="middle" className="fill-slate-500 text-[9px]">
                {new Date(point.timestamp).toLocaleDateString(lang, { month: 'short', year: '2-digit', timeZone: 'UTC' })}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function SnapshotPicker({ label, date, hour, resolved, onDate, onHour, t, lang }) {
  return (
    <fieldset className="space-y-1">
      <legend className="text-xs font-bold text-slate-300">{label}</legend>
      <div className="grid grid-cols-[minmax(0,1fr)_112px] gap-2">
        <input type="date" value={date} onChange={(event) => onDate(event.target.value)} className="min-w-0 rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-slate-100 [color-scheme:dark]" />
        <select value={hour} onChange={(event) => onHour(event.target.value)} className="rounded-lg bg-slate-950 px-2 py-2.5 text-xs text-slate-100">
          <option value="">{t('pages.targeting.automaticHour')}</option>
          {UTC_HOURS.map((value) => <option key={value} value={value}>{value}:00 UTC</option>)}
        </select>
      </div>
      <p className="min-h-4 truncate font-mono text-[9px] text-indigo-300">
        {resolved ? new Date(resolved.timestamp).toLocaleString(lang, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC' : '—'}
      </p>
    </fieldset>
  );
}

export function FleetIntelligencePage() {
  const { t, lang } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [directory, setDirectory] = useState([]);
  const [latestSnapshots, setLatestSnapshots] = useState([]);
  const [fleetName, setFleetName] = useState('');
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [historyRange, setHistoryRange] = useState('all');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [metric, setMetric] = useState('stars');
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(null);

  const [firstDate, setFirstDate] = useState('');
  const [firstHour, setFirstHour] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [secondHour, setSecondHour] = useState('');
  const [firstSnapshot, setFirstSnapshot] = useState(null);
  const [secondSnapshot, setSecondSnapshot] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getLatestFleetSnapshots(2)]).then(async ([snapshots]) => {
      const fleets = snapshots[0] ? await getCollectionAlliances(snapshots[0].collection_id) : [];
      if (cancelled) return;
      setLatestSnapshots(snapshots);
      setDirectory(fleets.sort((a, b) => a.name.localeCompare(b.name, lang, { sensitivity: 'base' })));
      const requestedId = searchParams.get('fleet');
      const requested = fleets.find((fleet) => String(fleet.id) === String(requestedId));
      if (requested) {
        setSelectedFleet(requested);
        setFleetName(requested.name);
      }
      setPageLoading(false);
    });
    return () => { cancelled = true; };
  }, [lang]);

  useEffect(() => {
    if (!selectedFleet) {
      setHistory([]);
      setMembers([]);
      return undefined;
    }
    let cancelled = false;
    setHistoryLoading(true);
    const interval = historyRange === 'all' ? 'month' : 'day';
    const take = historyRange === '30' ? 30 : historyRange === '90' ? 90 : 100;
    Promise.all([
      getFleetHistory(selectedFleet.id, interval, take),
      latestSnapshots[0]
        ? getAllianceDataFromCollection(latestSnapshots[0].collection_id, selectedFleet.id, selectedFleet.name)
        : Promise.resolve([])
    ]).then(([historyPoints, roster]) => {
      if (cancelled) return;
      setHistory(historyPoints);
      setMembers(roster);
      setHistoryLoading(false);
    });
    return () => { cancelled = true; };
  }, [historyRange, latestSnapshots, selectedFleet]);

  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      const latest = latestSnapshots.length ? latestSnapshots : await getLatestFleetSnapshots(2);
      const [first, second] = await Promise.all([
        firstDate || firstHour ? getFleetSnapshotAt(firstDate, firstHour) : Promise.resolve(latest[1] || latest[0] || null),
        secondDate || secondHour ? getFleetSnapshotAt(secondDate, secondHour) : Promise.resolve(latest[0] || null)
      ]);
      if (!cancelled) {
        setFirstSnapshot(first);
        setSecondSnapshot(second);
        setComparison(null);
      }
    };
    resolve();
    return () => { cancelled = true; };
  }, [firstDate, firstHour, latestSnapshots, secondDate, secondHour]);

  const selectFleetName = (value) => {
    setFleetName(value);
    const match = directory.find((fleet) => fleet.name.localeCompare(value, lang, { sensitivity: 'base' }) === 0) || null;
    setSelectedFleet(match);
    setComparison(null);
    setSearchParams(match ? { fleet: String(match.id) } : {});
  };

  const openUser = (user) => setActiveUser(user);

  const compareSnapshots = async () => {
    if (!selectedFleet || !firstSnapshot || !secondSnapshot) return;
    setComparisonLoading(true);
    const [firstMembers, secondMembers] = await Promise.all([
      getAllianceDataFromCollection(firstSnapshot.collection_id, selectedFleet.id, selectedFleet.name),
      getAllianceDataFromCollection(secondSnapshot.collection_id, selectedFleet.id, selectedFleet.name)
    ]);
    setComparison(compareFleetMembers(firstMembers, secondMembers));
    setComparisonLoading(false);
  };

  const filteredMembers = useMemo(() => members
    .filter((member) => member.name.toLowerCase().includes(memberSearch.toLowerCase()))
    .sort((a, b) => b.trophy - a.trophy || a.name.localeCompare(b.name, lang)), [lang, memberSearch, members]);
  const firstPoint = history[0];
  const lastPoint = history.at(-1);
  const delta = (key) => (Number(lastPoint?.[key]) || 0) - (Number(firstPoint?.[key]) || 0);

  const UserName = ({ user }) => (
    <button type="button" onClick={() => openUser(user)} className="font-bold text-slate-200 underline-offset-2 hover:text-indigo-300 hover:underline">
      {user.name}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.fleet.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.fleet.description')}</p>
        </div>
      </div>

      <section className="rounded-lg bg-slate-900 p-4 sm:p-6">
        <label className="block max-w-xl space-y-1">
          <span className="text-xs font-bold text-slate-300">{t('pages.fleet.chooseFleet')}</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="search" list="fleet-intelligence-options" value={fleetName} onChange={(event) => selectFleetName(event.target.value)} placeholder={t('pages.fleet.searchFleet')} className="w-full rounded-lg bg-slate-950 py-3 pl-10 pr-3 text-sm text-slate-100" />
            <datalist id="fleet-intelligence-options">{directory.map((fleet) => <option key={fleet.id} value={fleet.name}>#{fleet.id}</option>)}</datalist>
          </div>
        </label>
        {pageLoading && <p className="mt-3 font-mono text-[10px] text-slate-500">{t('common.loading')}</p>}
      </section>

      {selectedFleet && (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [t('pages.fleet.fleetStars'), selectedFleet.stars, delta('stars')],
              [t('pages.fleet.fleetTrophies'), selectedFleet.trophy, delta('trophy')],
              [t('pages.fleet.members'), members.length || selectedFleet.memberCount, delta('memberCount')],
              [t('pages.fleet.memberStars'), members.reduce((sum, member) => sum + member.totalStars, 0), delta('totalMemberStars')]
            ].map(([label, value, change]) => (
              <div key={label} className="rounded-lg bg-slate-900 p-4">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">{label}</div>
                <div className="mt-1 font-mono text-xl font-black text-slate-100">{Number(value || 0).toLocaleString()}</div>
                <div className={`mt-1 font-mono text-[10px] ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{change >= 0 ? '+' : ''}{change.toLocaleString()} {t('pages.fleet.overHistory')}</div>
              </div>
            ))}
          </section>

          <section className="overflow-hidden rounded-lg bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <div><h2 className="flex items-center gap-2 text-sm font-black text-slate-100"><TrendingUp className="h-4 w-4 text-indigo-400" />{t('pages.fleet.growth')}</h2><p className="mt-1 text-[10px] text-slate-500">{t('pages.fleet.growthDescription')}</p></div>
              <div className="flex gap-1 rounded-lg bg-slate-950 p-1">
                {[['30', '30D'], ['90', '90D'], ['all', t('pages.fleet.allHistory')]].map(([value, label]) => <button key={value} type="button" onClick={() => setHistoryRange(value)} className={`rounded-md px-3 py-2 text-[10px] font-bold ${historyRange === value ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{label}</button>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 px-4 pb-3 sm:px-5">{Object.entries(METRICS).map(([key, config]) => <button key={key} type="button" onClick={() => setMetric(key)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${metric === key ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-500'}`}><span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />{t(`pages.fleet.${config.labelKey}`)}</button>)}</div>
            {historyLoading ? <div className="flex min-h-72 items-center justify-center font-mono text-xs text-slate-500">{t('pages.fleet.loadingHistory')}</div> : history.length ? <HistoryChart points={history} metric={metric} t={t} lang={lang} /> : <div className="p-12 text-center text-xs text-slate-500">{t('pages.fleet.noHistory')}</div>}
          </section>

          <section className="overflow-hidden rounded-lg bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5"><div><h2 className="flex items-center gap-2 text-sm font-black text-slate-100"><Users className="h-4 w-4 text-indigo-400" />{t('pages.fleet.roster', { count: members.length })}</h2><p className="mt-1 text-[10px] text-slate-500">{t('pages.fleet.clickUserHint')}</p></div><input type="search" value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder={t('pages.fleet.searchMember')} className="rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-100" /></div>
            <div className="max-h-[620px] overflow-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="sticky top-0 bg-slate-950 text-[9px] uppercase text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">{t('pages.targeting.member')}</th><th className="px-4 py-3 text-right">{t('pages.targeting.columns.trophies')}</th><th className="px-4 py-3 text-right">{t('pages.targeting.columns.totalStars')}</th><th className="px-4 py-3 text-right">{t('pages.targeting.historyColumns.starValue')}</th></tr></thead><tbody>{filteredMembers.map((member, index) => <tr key={member.id} className="border-t border-slate-800/50 hover:bg-slate-800/30"><td className="px-4 py-3 font-mono text-slate-600">{index + 1}</td><td className="px-4 py-3"><UserName user={member} /><div className="font-mono text-[8px] text-slate-600">#{member.id}</div></td><td className="px-4 py-3 text-right font-mono">{member.trophy.toLocaleString()}</td><td className="px-4 py-3 text-right font-mono text-amber-300">{member.totalStars.toLocaleString()}</td><td className="px-4 py-3 text-right font-mono text-indigo-300">{member.starValue.toLocaleString()}</td></tr>)}</tbody></table></div>
          </section>

          <section className="space-y-4 rounded-lg bg-slate-900 p-4 sm:p-6">
            <div><h2 className="flex items-center gap-2 text-sm font-black text-slate-100"><ArrowRightLeft className="h-4 w-4 text-indigo-400" />{t('pages.fleet.snapshotComparison')}</h2><p className="mt-1 text-[10px] text-slate-500">{t('pages.targeting.snapshotSelectionRules')}</p></div>
            <div className="grid gap-3 md:grid-cols-2"><SnapshotPicker label={t('pages.targeting.firstSnapshot')} date={firstDate} hour={firstHour} resolved={firstSnapshot} onDate={setFirstDate} onHour={setFirstHour} t={t} lang={lang} /><SnapshotPicker label={t('pages.targeting.secondSnapshot')} date={secondDate} hour={secondHour} resolved={secondSnapshot} onDate={setSecondDate} onHour={setSecondHour} t={t} lang={lang} /></div>
            <button type="button" onClick={compareSnapshots} disabled={comparisonLoading || !firstSnapshot || !secondSnapshot || firstSnapshot.collection_id === secondSnapshot.collection_id} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-40">{comparisonLoading ? t('pages.targeting.comparingSnapshots') : t('pages.targeting.compareSnapshots')}</button>
            {comparison && <div className="space-y-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{[[t('pages.targeting.firstCount'), comparison.firstCount], [t('pages.targeting.secondCount'), comparison.secondCount], [t('pages.targeting.membersChanged'), comparison.changedCount], [t('pages.targeting.membersJoined'), comparison.joined.length], [t('pages.targeting.membersLeft'), comparison.left.length]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-950 p-3"><div className="text-[8px] font-bold uppercase text-slate-500">{label}</div><div className="mt-1 font-mono text-xl font-black text-slate-100">{value}</div></div>)}</div><div className="grid gap-4 md:grid-cols-2">{[[t('pages.targeting.membersJoinedList', { count: comparison.joined.length }), comparison.joined, 'text-emerald-300'], [t('pages.targeting.membersLeftList', { count: comparison.left.length }), comparison.left, 'text-rose-300']].map(([label, list, color]) => <div key={label} className="rounded-lg bg-slate-950 p-4"><h3 className={`mb-2 text-xs font-black ${color}`}>{label}</h3>{list.map((user) => <div key={user.id} className="flex justify-between border-t border-slate-900 py-2 text-xs"><UserName user={user} /><span className="font-mono text-[9px] text-slate-600">#{user.id}</span></div>)}</div>)}</div></div>}
          </section>
        </>
      )}

      <PlayerDetailModal player={activeUser} onClose={() => setActiveUser(null)} />
    </div>
  );
}

export default FleetIntelligencePage;
