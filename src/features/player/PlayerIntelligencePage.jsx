import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { History, Search, Shield, Trophy } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { searchUsers } from '../../services/pssPublicApi';
import { getUserHistory } from '../../services/fleetDataApi';
import {
  buildFleetMembershipHistory,
  buildMonthlyPlayerHistory,
  buildTournamentHistory
} from './playerHistoryAnalysis';

function PlayerHistoryChart({ points, metric, lang, t }) {
  if (!points.length) return null;
  const width = 960;
  const height = 280;
  const margin = { top: 20, right: 24, bottom: 48, left: 72 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const values = points.map((point) => Number(point[metric]) || 0);
  const max = Math.max(1, ...values);
  const x = (index) => margin.left + (points.length === 1 ? plotWidth / 2 : index / (points.length - 1) * plotWidth);
  const y = (value) => margin.top + plotHeight - value / max * plotHeight;
  const color = metric === 'trophy' ? '#6366f1' : '#f59e0b';
  const labelStep = Math.max(1, Math.ceil(points.length / 6));
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[720px]" role="img" aria-label={t('pages.player.historyChart')}>
        {Array.from({ length: 5 }, (_, index) => {
          const value = max / 4 * index;
          return <g key={index}><line x1={margin.left} x2={width - margin.right} y1={y(value)} y2={y(value)} stroke="#64748b" strokeOpacity="0.18" /><text x={margin.left - 10} y={y(value) + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">{Math.round(value).toLocaleString()}</text></g>;
        })}
        <polyline points={points.map((point, index) => `${x(index)},${y(Number(point[metric]) || 0)}`).join(' ')} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point, index) => <g key={`${point.timestamp}-${index}`}><circle cx={x(index)} cy={y(Number(point[metric]) || 0)} r="3.5" fill={color}><title>{`${point.date}: ${(Number(point[metric]) || 0).toLocaleString()}`}</title></circle>{(index % labelStep === 0 || index === points.length - 1) && <text x={x(index)} y={height - 18} textAnchor="middle" className="fill-slate-500 text-[9px]">{new Date(point.timestamp).toLocaleDateString(lang, { month: 'short', year: '2-digit', timeZone: 'UTC' })}</text>}</g>)}
      </svg>
    </div>
  );
}

export function PlayerIntelligencePage() {
  const { t, lang } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [metric, setMetric] = useState('trophy');
  const [historyTab, setHistoryTab] = useState('fleets');
  const isEmbedded = searchParams.get('embed') === 'true';

  const loadPlayer = async (player) => {
    const normalized = { ...player, id: String(player.id) };
    setSelectedPlayer(normalized);
    setHistoryData(null);
    setLoadingHistory(true);
    setSearchParams(isEmbedded ? { player: normalized.id, embed: 'true' } : { player: normalized.id });
    const detail = await getUserHistory(normalized.id);
    setHistoryData(detail);
    setLoadingHistory(false);
  };

  useEffect(() => {
    const playerId = searchParams.get('player');
    if (!playerId || selectedPlayer) return;
    let cancelled = false;
    setLoadingHistory(true);
    getUserHistory(playerId).then((detail) => {
      if (cancelled) return;
      const latest = detail.historyList?.[0];
      setSelectedPlayer({ id: playerId, name: latest?.name || `Captain #${playerId}` });
      setHistoryData(detail);
      setLoadingHistory(false);
    });
    return () => { cancelled = true; };
  }, []);

  const submitSearch = async (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) return;
    setSearching(true);
    setResults(await searchUsers(value));
    setSearching(false);
  };

  const historyList = historyData?.historyList || [];
  const latest = historyList[0];
  const memberships = useMemo(() => buildFleetMembershipHistory(historyList), [historyList]);
  const tournaments = useMemo(() => buildTournamentHistory(historyList), [historyList]);
  const monthlyHistory = useMemo(() => buildMonthlyPlayerHistory(historyList), [historyList]);

  const ClickableName = ({ player, className = '' }) => (
    <button type="button" onClick={() => loadPlayer(player)} className={`font-bold underline-offset-2 hover:text-indigo-300 hover:underline ${className}`}>
      {player.name}
    </button>
  );

  return (
    <div className={`mx-auto max-w-7xl space-y-6 ${isEmbedded ? 'pb-4' : 'pb-20'}`}>
      {!isEmbedded && <div className="page-header"><div><h1 className="page-title">{t('pages.player.title')}</h1><p className="mt-1 text-xs text-slate-400">{t('pages.player.description')}</p></div></div>}

      {!isEmbedded && <section className="rounded-lg bg-slate-900 p-4 sm:p-6">
        <form onSubmit={submitSearch} className="flex max-w-2xl flex-col gap-2 sm:flex-row">
          <label className="relative flex-1"><span className="sr-only">{t('pages.player.searchLabel')}</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('pages.player.searchPlaceholder')} className="w-full rounded-lg bg-slate-950 py-3 pl-10 pr-3 text-sm text-slate-100" /></label>
          <button type="submit" disabled={searching || query.trim().length < 2} className="rounded-lg bg-indigo-600 px-5 py-3 text-xs font-black text-white disabled:opacity-40">{searching ? t('pages.player.searching') : t('pages.player.search')}</button>
        </form>
        {results.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{results.map((player) => <button key={player.id} type="button" onClick={() => loadPlayer(player)} className="rounded-lg bg-slate-950 p-3 text-left transition hover:bg-slate-800"><div className="font-bold text-slate-100 hover:text-indigo-300">{player.name}</div><div className="mt-1 flex justify-between font-mono text-[9px] text-slate-500"><span>#{player.id}</span><span>{player.allianceName}</span><span>{player.trophy.toLocaleString()} 🏆</span></div></button>)}</div>}
        {!searching && query.trim().length >= 2 && results.length === 0 && <p className="mt-4 text-xs text-slate-500">{t('pages.player.searchHint')}</p>}
      </section>}

      {selectedPlayer && <>
        <section className="rounded-lg bg-slate-900 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><ClickableName player={selectedPlayer} className="text-xl text-slate-100" /><div className="mt-1 font-mono text-[10px] text-slate-500">#{selectedPlayer.id}</div></div>{latest && <div className="text-right"><div className="text-xs font-bold text-indigo-300">{latest.fleetName}</div><div className="mt-1 font-mono text-[10px] text-slate-500">{t('pages.player.lastRecorded', { date: latest.date })}</div></div>}</div>
          {historyData?.pastNames?.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-[9px] font-black uppercase text-slate-500">{t('pages.player.knownNames')}</span>{historyData.pastNames.map((name) => <ClickableName key={name} player={{ ...selectedPlayer, name }} className="rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-200" />)}</div>}
        </section>

        {loadingHistory ? <div className="rounded-lg bg-slate-900 p-16 text-center font-mono text-xs text-slate-500">{t('pages.player.loadingHistory')}</div> : <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[[t('pages.player.currentTrophies'), latest?.trophy || selectedPlayer.trophy || 0, 'text-indigo-300'], [t('pages.player.highestTrophies'), latest?.maxTrophy || selectedPlayer.highestTrophy || 0, 'text-amber-300'], [t('pages.player.fleetsJoined'), memberships.length, 'text-emerald-300'], [t('pages.player.tournamentsRecorded'), tournaments.length, 'text-cyan-300']].map(([label, value, color]) => <div key={label} className="rounded-lg bg-slate-900 p-4"><div className="text-[9px] font-black uppercase text-slate-500">{label}</div><div className={`mt-1 font-mono text-xl font-black ${color}`}>{Number(value).toLocaleString()}</div></div>)}</section>

          <section className="overflow-hidden rounded-lg bg-slate-900"><div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5"><div><h2 className="flex items-center gap-2 text-sm font-black text-slate-100"><History className="h-4 w-4 text-indigo-400" />{t('pages.player.progression')}</h2><p className="mt-1 text-[10px] text-slate-500">{t('pages.player.progressionDescription')}</p></div><div className="flex rounded-lg bg-slate-950 p-1">{[['trophy', t('pages.player.trophies')], ['totalStars', t('pages.player.stars')]].map(([value, label]) => <button key={value} type="button" onClick={() => setMetric(value)} className={`rounded-md px-3 py-2 text-[10px] font-bold ${metric === value ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{label}</button>)}</div></div>{monthlyHistory.length ? <PlayerHistoryChart points={monthlyHistory} metric={metric} lang={lang} t={t} /> : <div className="p-12 text-center text-xs text-slate-500">{t('pages.player.noHistory')}</div>}</section>

          <div className="flex w-full rounded-lg bg-slate-900 p-1 sm:w-fit" role="tablist" aria-label={t('pages.player.historyTabs')}>
            {[['fleets', t('pages.player.fleetHistory'), Shield], ['tournaments', t('pages.player.tournamentHistory'), Trophy]].map(([value, label, Icon]) => <button key={value} type="button" role="tab" aria-selected={historyTab === value} onClick={() => setHistoryTab(value)} className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-xs font-black transition sm:flex-none ${historyTab === value ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}><Icon className="h-4 w-4" />{label}</button>)}
          </div>

          {historyTab === 'fleets' && <section className="overflow-hidden rounded-lg bg-slate-900"><div className="p-4 sm:p-5"><h2 className="flex items-center gap-2 text-sm font-black text-slate-100"><Shield className="h-4 w-4 text-emerald-400" />{t('pages.player.fleetHistory')}</h2><p className="mt-1 text-[10px] text-slate-500">{t('pages.player.fleetHistoryDescription')}</p></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-slate-950 text-[9px] uppercase text-slate-500"><tr><th className="px-4 py-3">{t('pages.player.fleet')}</th><th className="px-4 py-3">{t('pages.player.firstSeen')}</th><th className="px-4 py-3">{t('pages.player.lastSeen')}</th><th className="px-4 py-3 text-right">{t('pages.player.records')}</th><th className="px-4 py-3 text-right">{t('pages.player.trophyChange')}</th></tr></thead><tbody>{memberships.map((period, index) => <tr key={`${period.fleetName}-${period.joinedAt}-${index}`} className="border-t border-slate-800/60"><td className="px-4 py-3 font-bold text-slate-200">{period.fleetName}</td><td className="px-4 py-3 font-mono text-slate-400">{new Date(period.joinedAt).toLocaleDateString(lang, { timeZone: 'UTC' })}</td><td className="px-4 py-3 font-mono text-slate-400">{new Date(period.leftAt).toLocaleDateString(lang, { timeZone: 'UTC' })}</td><td className="px-4 py-3 text-right font-mono">{period.records}</td><td className="px-4 py-3 text-right font-mono text-indigo-300">{period.lastTrophy - period.firstTrophy >= 0 ? '+' : ''}{(period.lastTrophy - period.firstTrophy).toLocaleString()}</td></tr>)}</tbody></table></div></section>}

          {historyTab === 'tournaments' && <section className="overflow-hidden rounded-lg bg-slate-900"><div className="p-4 sm:p-5"><h2 className="flex items-center gap-2 text-sm font-black text-slate-100"><Trophy className="h-4 w-4 text-amber-400" />{t('pages.player.tournamentHistory')}</h2><p className="mt-1 text-[10px] text-slate-500">{t('pages.player.tournamentDescription')}</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-950 text-[9px] uppercase text-slate-500"><tr><th className="px-4 py-3">{t('pages.player.tournament')}</th><th className="px-4 py-3">{t('pages.player.fleet')}</th><th className="px-4 py-3">{t('pages.targeting.historyColumns.division')}</th><th className="px-4 py-3 text-right">{t('pages.player.trophies')}</th><th className="px-4 py-3 text-right">{t('pages.player.stars')}</th><th className="px-4 py-3 text-right">{t('pages.player.battles')}</th></tr></thead><tbody>{tournaments.map((entry) => <tr key={entry.month} className="border-t border-slate-800/60"><td className="px-4 py-3 font-bold text-slate-200">{new Date(`${entry.month}-01T00:00:00Z`).toLocaleDateString(lang, { month: 'long', year: 'numeric', timeZone: 'UTC' })}</td><td className="px-4 py-3 text-slate-300">{entry.fleetName}</td><td className="px-4 py-3 text-slate-400">{entry.division}</td><td className="px-4 py-3 text-right font-mono">{entry.trophy.toLocaleString()}</td><td className="px-4 py-3 text-right font-mono text-amber-300">{entry.totalStars.toLocaleString()}</td><td className="px-4 py-3 text-right font-mono text-cyan-300">{entry.tournamentBonusScore || 0}</td></tr>)}</tbody></table></div>{tournaments.length === 0 && <div className="p-10 text-center text-xs text-slate-500">{t('pages.player.noTournaments')}</div>}</section>}

        </>}
      </>}
    </div>
  );
}

export default PlayerIntelligencePage;
