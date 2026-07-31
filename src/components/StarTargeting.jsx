import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  getRunningCollectionId,
  getAllianceDataFromCollection,
  getLatestAllianceData,
  getUserHistory,
  getAllianceTournamentProgression,
  getAllianceTournamentAnalytics,
  getTournamentCollectionAlliances,
  getTournamentCollections
} from '../services/fleetDataApi';
import { getAllianceRankingsWithDivisions, getTournamentStatus } from '../services/pssPublicApi';
import { getTargetStatuses, setTargetStatus, exportToCSV } from '../services/storageService';
import { Search, Download, RefreshCw, CheckCircle, XCircle, HelpCircle, Copy, History, X, Trophy, LineChart, List, Tag, Shield, ChevronUp, ChevronDown, ChevronsUpDown, BarChart3, Users } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const HOURLY_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const FLEET_CHART_COLORS = [
  '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4',
  '#f97316', '#ec4899', '#84cc16', '#14b8a6', '#6366f1', '#eab308'
];

const tournamentPeriodFromCollection = (collection) => {
  const end = new Date(collection.timestamp);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);
  start.setUTCHours(0, 0, 0, 0);
  return {
    isLive: false,
    currentDay: 7,
    totalDays: 7,
    tournamentStartDate: start.toISOString(),
    tournamentEndDate: end.toISOString()
  };
};

const mapWithConcurrency = async (values, limit, worker) => {
  const results = new Array(values.length);
  let nextIndex = 0;
  const run = async () => {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(values[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, run));
  return results;
};

const FleetGrowthChart = ({ fleets, t }) => {
  const width = 960;
  const height = 380;
  const margin = { top: 24, right: 24, bottom: 48, left: 72 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const dayCount = Math.max(1, ...fleets.map((fleet) => fleet.daily.length));
  const maxStars = Math.max(1, ...fleets.flatMap((fleet) => fleet.daily.map((day) => day.cumulativeStars)));
  const roundedMax = Math.ceil(maxStars / 1000) * 1000 || 1000;
  const x = (index) => margin.left + (dayCount === 1 ? 0 : (index / (dayCount - 1)) * plotWidth);
  const y = (value) => margin.top + plotHeight - (value / roundedMax) * plotHeight;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px] w-full" role="img" aria-label={t('pages.targeting.growthChart')}>
          {Array.from({ length: 6 }, (_, index) => {
            const value = (roundedMax / 5) * index;
            const yPosition = y(value);
            return (
              <g key={value}>
                <line
                  x1={margin.left}
                  x2={width - margin.right}
                  y1={yPosition}
                  y2={yPosition}
                  stroke="#94a3b8"
                  strokeOpacity="0.22"
                  strokeWidth="1"
                />
                <text x={margin.left - 12} y={yPosition + 4} textAnchor="end" className="fill-slate-500 text-[11px] font-mono">
                  {Math.round(value).toLocaleString()}
                </text>
              </g>
            );
          })}
          {Array.from({ length: dayCount }, (_, index) => (
            <g key={index}>
              <line
                x1={x(index)}
                x2={x(index)}
                y1={margin.top}
                y2={height - margin.bottom}
                stroke="#94a3b8"
                strokeOpacity="0.12"
                strokeWidth="1"
              />
              <text x={x(index)} y={height - 20} textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">
                {t('pages.targeting.day', { day: index + 1 })}
              </text>
            </g>
          ))}
          {fleets.map((fleet, fleetIndex) => {
            const color = FLEET_CHART_COLORS[fleetIndex % FLEET_CHART_COLORS.length];
            const points = fleet.daily.map((day, index) => `${x(index)},${y(day.cumulativeStars)}`).join(' ');
            return (
              <g key={fleet.fleetId}>
                <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                {fleet.daily.map((day, index) => (
                  <circle key={day.date} cx={x(index)} cy={y(day.cumulativeStars)} r="4" fill={color}>
                    <title>{`${fleet.fleetName} · ${day.date} · ${day.cumulativeStars.toLocaleString()} ★`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex max-h-32 flex-wrap gap-x-4 gap-y-2 overflow-y-auto px-4 py-3">
        {fleets.map((fleet, index) => (
          <span key={fleet.fleetId} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FLEET_CHART_COLORS[index % FLEET_CHART_COLORS.length] }} />
            {fleet.fleetName}
          </span>
        ))}
      </div>
    </div>
  );
};

const millisecondsUntilNextHourlyRefresh = () => {
  const now = new Date();
  const nextRefresh = new Date(now);
  nextRefresh.setUTCMinutes(2, 0, 0);
  if (nextRefresh <= now) {
    nextRefresh.setUTCHours(nextRefresh.getUTCHours() + 1);
  }
  return nextRefresh.getTime() - now.getTime();
};

const SortableHeader = ({ label, sortKey, sortConfig, onSort, title }) => {
  const isActive = sortConfig.key === sortKey;
  const SortIcon = !isActive
    ? ChevronsUpDown
    : sortConfig.direction === 'asc'
      ? ChevronUp
      : ChevronDown;

  return (
    <th
      className="p-4"
      aria-sort={isActive ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1.5 text-left transition-colors hover:text-slate-100 ${
          isActive ? 'text-indigo-300' : ''
        }`}
        title={title}
      >
        <span>{label}</span>
        <SortIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
      </button>
    </th>
  );
};

const HistoryLineChart = ({ data }) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [data]);

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  const nodeSpacing = 75;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 40;
  const paddingBottom = 45;

  const width = Math.max(950, sorted.length * nodeSpacing + paddingLeft + paddingRight);
  const height = 280;

  const trophies = sorted.map(d => d.trophy);
  const maxTrophy = Math.max(...trophies, 5000);
  const minTrophy = Math.min(...trophies, 0);

  const getX = (index) => paddingLeft + index * nodeSpacing;
  const getY = (value) => height - paddingBottom - ((value - minTrophy) / (maxTrophy - minTrophy || 1)) * (height - paddingTop - paddingBottom);

  const trophyPoints = sorted.map((d, i) => `${getX(i)},${getY(d.trophy)}`).join(' ');

  return (
    <div className="bg-slate-950 p-5 rounded-lg mb-6 space-y-3 shadow-inner">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-amber-400 font-bold">
          {t('pages.targeting.chartTitle')}
        </span>
        <span className="text-slate-400 font-mono">
          {t('pages.targeting.chartRecords', { count: sorted.length })}
        </span>
      </div>

      <div ref={scrollRef} className="w-full overflow-x-auto pb-2 scroll-smooth">
        <svg width={width} height={height} className="overflow-visible min-w-full">
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * (height - paddingTop - paddingBottom);
            const val = Math.round(maxTrophy - ratio * (maxTrophy - minTrophy));
            return (
              <g key={idx}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end">{val.toLocaleString()}</text>
              </g>
            );
          })}

          <polyline fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={trophyPoints} />

          {sorted.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.trophy);
            const isClosest12 = i < 12;

            return (
              <g key={i} className="group cursor-pointer">
                {isClosest12 && (
                  <circle cx={cx} cy={cy} r="10" fill="rgba(245, 158, 11, 0.15)" className="animate-pulse" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r="6"
                  fill={isClosest12 ? "#f59e0b" : "#64748b"}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  className="transition-all hover:r-8 hover:fill-emerald-400"
                />
                <text x={cx} y={cy - 12} fill="#34d399" fontSize="9" textAnchor="middle" fontWeight="bold">
                  ★{d.totalStars}
                </text>
                <text x={cx} y={height - 12} fill={isClosest12 ? "#e2e8f0" : "#64748b"} fontSize="9" textAnchor="middle" transform={`rotate(-25, ${cx}, ${height - 12})`}>
                  {d.date}
                </text>
                <title>
                  {t('pages.targeting.chartTooltip', {
                    date: d.date,
                    fleet: d.fleetName,
                    division: d.division,
                    trophies: d.trophy.toLocaleString(),
                    totalStars: d.totalStars,
                    starValue: d.starValue
                  })}
                </title>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-slate-400 pt-2">
        <span>{sorted[0]?.date}</span>
        <span>{sorted[sorted.length - 1]?.date}</span>
      </div>
    </div>
  );
};

const StarTargeting = () => {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState('fleet');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [alliances, setAlliances] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('Div A');
  const [searchName, setSearchName] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('ALL');
  const [minTrophy, setMinTrophy] = useState(0);
  const [maxTrophy, setMaxTrophy] = useState(10000);
  const [statuses, setStatuses] = useState(getTargetStatuses());
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [activeHistoryPlayer, setActiveHistoryPlayer] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [pastNames, setPastNames] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [viewMode, setViewMode] = useState('chart');
  const [tournamentStatus, setTournamentStatus] = useState(() => getTournamentStatus());
  const [dailyStarData, setDailyStarData] = useState(null);
  const [dailyStarsLoading, setDailyStarsLoading] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [tournamentCollections, setTournamentCollections] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('current');
  const [fleetTournamentData, setFleetTournamentData] = useState([]);
  const [fleetStatsLoading, setFleetStatsLoading] = useState(false);
  const [expandedFleetId, setExpandedFleetId] = useState(null);
  const loadRequestRef = useRef(0);
  const fleetStatsRequestRef = useRef(0);
  const [sortConfig, setSortConfig] = useState({
    key: 'totalStars',
    direction: 'desc'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const loadStarData = async (division = selectedDivision) => {
    const requestId = ++loadRequestRef.current;
    setLoading(true);
    setData([]);
    setAlliances([]);
    try {
      const currentTournamentStatus = getTournamentStatus();
      setTournamentStatus(currentTournamentStatus);
      const divisionRankings = await getAllianceRankingsWithDivisions(0, 100);
      const divAlliances = (divisionRankings[division] || []).map((alliance) => ({
        ...alliance,
        alliance_id: alliance.id,
        alliance_name: alliance.fleet
      }));
      if (requestId !== loadRequestRef.current) return;
      setAlliances(divAlliances);

      let allPlayers = [];
      let sourceTimestamp = null;
      if (currentTournamentStatus.isLive && divAlliances.length > 0) {
        const snapshots = await Promise.all(
          divAlliances.map((alliance) =>
            getLatestAllianceData(alliance.alliance_id, alliance.alliance_name)
          )
        );
        allPlayers = snapshots.flatMap((snapshot) => snapshot.players);
        const sourceTimes = snapshots
          .map((snapshot) => snapshot.timestamp)
          .filter(Boolean)
          .map((timestamp) => new Date(timestamp))
          .filter((timestamp) => !Number.isNaN(timestamp.getTime()));
        sourceTimestamp = sourceTimes.length > 0
          ? new Date(Math.max(...sourceTimes))
          : null;
      } else if (divAlliances.length > 0) {
        const collectionId = await getRunningCollectionId();
        if (collectionId) {
          const playerGroups = await Promise.all(
            divAlliances.map((alliance) =>
              getAllianceDataFromCollection(
                collectionId,
                alliance.alliance_id,
                alliance.alliance_name
              )
            )
          );
          allPlayers = playerGroups.flat();
        }
      }

      if (requestId === loadRequestRef.current) {
        setData(allPlayers);
        setLastFetchedAt(sourceTimestamp || new Date());
      }
    } catch (err) {
      console.error("Failed to load star data:", err);
    } finally {
      if (requestId === loadRequestRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    loadStarData();

    let hourlyRefresh;
    const firstRefresh = window.setTimeout(() => {
      loadStarData();
      hourlyRefresh = window.setInterval(loadStarData, HOURLY_REFRESH_INTERVAL_MS);
    }, millisecondsUntilNextHourlyRefresh());

    return () => {
      loadRequestRef.current += 1;
      window.clearTimeout(firstRefresh);
      if (hourlyRefresh) {
        window.clearInterval(hourlyRefresh);
      }
    };
  }, [selectedDivision]);

  useEffect(() => {
    let cancelled = false;
    getTournamentCollections().then((collections) => {
      if (!cancelled) setTournamentCollections(collections);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'fleet') return undefined;
    const requestId = ++fleetStatsRequestRef.current;

    const loadFleetStats = async () => {
      setFleetStatsLoading(true);
      setFleetTournamentData([]);
      setExpandedFleetId(null);

      const isCurrent = selectedTournament === 'current';
      const selectedCollection = isCurrent
        ? null
        : tournamentCollections.find(
          (collection) => String(collection.collection_id) === String(selectedTournament)
        );
      if (!isCurrent && !selectedCollection) {
        setFleetStatsLoading(false);
        return;
      }

      const period = isCurrent
        ? tournamentStatus
        : tournamentPeriodFromCollection(selectedCollection);
      const tournamentFleets = isCurrent
        ? alliances
        : await getTournamentCollectionAlliances(
          selectedCollection.collection_id,
          selectedDivision
        );

      if (requestId !== fleetStatsRequestRef.current) return;
      if (isCurrent && loading) {
        setFleetStatsLoading(false);
        return;
      }

      const analytics = await mapWithConcurrency(tournamentFleets, 6, async (fleet) => {
        const result = await getAllianceTournamentAnalytics(
          fleet.alliance_id,
          fleet.alliance_name,
          period
        );
        return {
          ...result,
          rank: fleet.rank,
          rosterSize: fleet.members,
          officialStars: fleet.stars
        };
      });

      if (requestId === fleetStatsRequestRef.current) {
        setFleetTournamentData(analytics);
        setFleetStatsLoading(false);
      }
    };

    loadFleetStats();
    return () => {
      fleetStatsRequestRef.current += 1;
    };
  }, [
    activeTab,
    alliances,
    loading,
    selectedDivision,
    selectedTournament,
    tournamentCollections,
    tournamentStatus
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedRowId) return;
      const key = e.key.toLowerCase();
      if (key === 'w') {
        handleStatusChange(selectedRowId, 'W');
      } else if (key === 'l') {
        handleStatusChange(selectedRowId, 'L');
      } else if (key === 'u') {
        handleStatusChange(selectedRowId, 'U');
      } else if (e.key === 'Escape') {
        setActiveHistoryPlayer(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRowId]);

  const handleStatusChange = (id, newStatus) => {
    const updated = setTargetStatus(id, newStatus);
    setStatuses({ ...updated });
    const status = t(`pages.targeting.status${newStatus === 'W' ? 'Win' : newStatus === 'L' ? 'Loss' : 'Unclear'}`);
    showToast(t('pages.targeting.statusUpdated', { id, status }));
  };

  const copyPlayerName = (name) => {
    navigator.clipboard.writeText(name);
    showToast(t('pages.targeting.nameCopied', { name }));
  };

  const handleRowClick = async (player) => {
    setSelectedRowId(player.id);
    setActiveHistoryPlayer(player);
    setViewMode('chart');
    setDailyStarData(null);
    setHistoryLoading(true);
    const shouldLoadDailyStars = tournamentStatus.isLive && Boolean(player.fleetId);
    setDailyStarsLoading(shouldLoadDailyStars);

    const historyRequest = getUserHistory(player.id);
    const progressionRequest = shouldLoadDailyStars
      ? getAllianceTournamentProgression(player.fleetId, player.fleet, tournamentStatus)
      : Promise.resolve(null);
    const [historyResult, progressionResult] = await Promise.allSettled([
      historyRequest,
      progressionRequest
    ]);

    if (historyResult.status === 'fulfilled') {
      const res = historyResult.value;
      setHistoryData(res.historyList || []);
      setPastNames(res.pastNames || [player.name]);
    } else {
      console.error("Failed to fetch user history:", historyResult.reason);
      setHistoryData([]);
      setPastNames([player.name]);
    }

    if (progressionResult.status === 'fulfilled' && progressionResult.value) {
      const progression = progressionResult.value;
      const member = progression.members.find(
        (candidate) => String(candidate.id) === String(player.id)
      );
      setDailyStarData(member ? {
        days: progression.days,
        dailyStars: member.dailyStars,
        tournamentStars: member.tournamentStars
      } : null);
    } else if (progressionResult.status === 'rejected') {
      console.error("Failed to fetch tournament star progression:", progressionResult.reason);
      setDailyStarData(null);
    }

    setHistoryLoading(false);
    setDailyStarsLoading(false);
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchFleet = selectedFleet === 'ALL' || item.fleet === selectedFleet;
      const matchTrophy = item.trophy >= minTrophy && item.trophy <= maxTrophy;
      return matchName && matchFleet && matchTrophy;
    });
  }, [data, searchName, selectedFleet, minTrophy, maxTrophy]);

  const sortedData = useMemo(() => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.key === 'status'
        ? statuses[a.id]?.status || ''
        : a[sortConfig.key];
      const bValue = sortConfig.key === 'status'
        ? statuses[b.id]?.status || ''
        : b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }

      return String(aValue ?? '').localeCompare(
        String(bValue ?? ''),
        lang,
        { numeric: true, sensitivity: 'base' }
      ) * direction;
    });
  }, [filteredData, lang, sortConfig, statuses]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key
        ? (current.direction === 'asc' ? 'desc' : 'asc')
        : (['trophy', 'maxTrophy', 'starValue', 'totalStars'].includes(key) ? 'desc' : 'asc')
    }));
  };

  const fleetOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map(d => d.fleet)));
    return ['ALL', ...unique];
  }, [data]);

  const selectedTournamentCollection = tournamentCollections.find(
    (collection) => String(collection.collection_id) === String(selectedTournament)
  );
  const selectedTournamentPeriod = selectedTournament === 'current'
    ? tournamentStatus
    : selectedTournamentCollection
      ? tournamentPeriodFromCollection(selectedTournamentCollection)
      : null;
  const sortedFleetTournamentData = useMemo(
    () => [...fleetTournamentData].sort(
      (a, b) => b.totalStars - a.totalStars
        || a.fleetName.localeCompare(b.fleetName, lang, { sensitivity: 'base' })
    ),
    [fleetTournamentData, lang]
  );

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {toastMsg && (
        <div className="fixed bottom-3 left-3 right-3 z-50 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:text-left">
          {toastMsg}
        </div>
      )}

      <div className="page-header">
        <div>
            <h1 className="page-title">
              {t('pages.targeting.title')}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {t('pages.targeting.description')}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] font-mono text-cyan-400/80">
              <span>{t('pages.targeting.dataCadence')}</span>
              {lastFetchedAt && (
                <span>
                  • {t('pages.targeting.lastFetched', {
                    time: lastFetchedAt.toLocaleString(lang, {
                      timeZone: 'UTC',
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  })}
                </span>
              )}
            </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center">
            <button
              onClick={() => loadStarData()}
              disabled={loading}
              className="flex min-h-10 items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-500 disabled:opacity-50 sm:px-4"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{t('common.refreshData')}</span>
            </button>
            <button
              onClick={() => exportToCSV(filteredData.map(d => ({ ...d, status: statuses[d.id]?.status })))}
              className="flex min-h-10 items-center justify-center space-x-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-100 transition-all hover:bg-slate-700 sm:px-4"
            >
              <Download className="h-4 w-4 text-indigo-400" />
              <span>{t('common.exportCsv')}</span>
            </button>
        </div>
      </div>

      <div className="flex w-full gap-1 rounded-lg bg-slate-900 p-1 shadow-sm sm:w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab('fleet');
            setActiveHistoryPlayer(null);
          }}
          className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-xs font-black transition sm:flex-none ${
            activeTab === 'fleet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          {t('pages.targeting.fleetStatisticsTab')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('individual')}
          className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-xs font-black transition sm:flex-none ${
            activeTab === 'individual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          {t('pages.targeting.individualTab')}
        </button>
      </div>

      {activeTab === 'individual' && <div className="space-y-6 rounded-lg bg-slate-900 p-4 shadow-sm sm:p-8">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">{t('pages.targeting.division')}</label>
            <select
              value={selectedDivision}
              onChange={(event) => {
                setSelectedDivision(event.target.value);
                setSelectedFleet('ALL');
              }}
              className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {['Div A', 'Div B', 'Div C', 'Div D'].map((division) => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">{t('pages.targeting.searchName')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('pages.targeting.searchPlaceholder')}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-slate-950 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">{t('pages.targeting.filterFleet')}</label>
            <select
              value={selectedFleet}
              onChange={(e) => setSelectedFleet(e.target.value)}
              className="w-full bg-slate-950 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {fleetOptions.map(f => (
                <option key={f} value={f}>{f === 'ALL' ? t('pages.targeting.allFleets') : f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              {t('pages.targeting.minimumTrophies')}: <span className="text-indigo-400 font-mono">{minTrophy}</span>
            </label>
            <input
              type="range"
              min="0"
              max="8000"
              step="250"
              value={minTrophy}
              onChange={(e) => setMinTrophy(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer mt-2"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              {t('pages.targeting.maximumTrophies')}: <span className="text-indigo-400 font-mono">{maxTrophy}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="250"
              value={maxTrophy}
              onChange={(e) => setMaxTrophy(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Keyboard Legend */}
        <div className="pt-3 border-t border-slate-800/40 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5"><kbd className="px-2 py-0.5 rounded bg-slate-950 font-mono text-indigo-400 font-bold">W</kbd> <span>= {t('pages.targeting.markWin')}</span></span>
          <span className="flex items-center space-x-1.5"><kbd className="px-2 py-0.5 rounded bg-slate-950 font-mono text-rose-400 font-bold">L</kbd> <span>= {t('pages.targeting.markLoss')}</span></span>
          <span className="flex items-center space-x-1.5"><kbd className="px-2 py-0.5 rounded bg-slate-950 font-mono text-amber-400 font-bold">U</kbd> <span>= {t('pages.targeting.markUnclear')}</span></span>
          <span className="text-slate-400 font-mono ml-auto">{t('pages.targeting.openHistoryHint')}</span>
        </div>
      </div>}

      {activeTab === 'fleet' && <div className="overflow-hidden rounded-lg bg-slate-900 shadow-sm">
        <div className="grid gap-3 p-4 sm:grid-cols-[180px_minmax(240px,1fr)] sm:p-5">
          <label className="space-y-1">
            <span className="block text-xs font-bold text-slate-300">{t('pages.targeting.division')}</span>
            <select
              value={selectedDivision}
              onChange={(event) => {
                setSelectedDivision(event.target.value);
                setSelectedFleet('ALL');
              }}
              className="w-full rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {['Div A', 'Div B', 'Div C', 'Div D'].map((division) => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-bold text-slate-300">{t('pages.targeting.tournament')}</span>
            <select
              value={selectedTournament}
              onChange={(event) => setSelectedTournament(event.target.value)}
              className="w-full rounded-lg bg-slate-950 px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="current">{t('pages.targeting.currentTournament')}</option>
              {tournamentCollections.map((collection, index) => (
                <option key={collection.collection_id} value={collection.collection_id}>
                  {index === 0 ? `${t('pages.targeting.lastTournament')} · ` : ''}
                  {new Date(collection.timestamp).toLocaleDateString(lang, {
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-black text-slate-100">{t('pages.targeting.fleetAnalytics')}</h2>
            <p className="mt-1 text-[10px] text-slate-500">
              {t('pages.targeting.fleetAnalyticsDescription', {
                division: selectedDivision,
                count: fleetTournamentData.length
              })}
            </p>
          </div>
          <span className="font-mono text-[10px] font-bold text-indigo-300">
            {t('pages.targeting.participantsLoaded', {
              count: fleetTournamentData.reduce((sum, fleet) => sum + fleet.participantCount, 0)
            })}
          </span>
        </div>
        <div>
          {selectedTournamentPeriod && (
            <div className="px-4 pt-4 text-center sm:px-5">
              <h3 className="text-sm font-black text-slate-100">
                {t('pages.targeting.starsForPeriod', {
                  start: new Date(selectedTournamentPeriod.tournamentStartDate).toLocaleDateString(lang, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC'
                  }),
                  end: new Date(selectedTournamentPeriod.tournamentEndDate).toLocaleDateString(lang, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })
                })}
              </h3>
            </div>
          )}
          {fleetStatsLoading ? (
            <div className="flex min-h-80 items-center justify-center font-mono text-xs text-slate-500">
              {t('pages.targeting.loadingFleetAnalytics')}
            </div>
          ) : fleetTournamentData.length > 0 ? (
            <FleetGrowthChart fleets={sortedFleetTournamentData} t={t} />
          ) : (
            <div className="flex min-h-52 items-center justify-center font-mono text-xs text-slate-500">
              {t('pages.targeting.noFleetsInDivision')}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">{t('pages.targeting.columns.fleet')}</th>
                <th className="px-4 py-3 text-right">{t('pages.targeting.participants')}</th>
                <th className="px-4 py-3 text-right">{t('pages.targeting.tournamentStars')}</th>
                <th className="px-4 py-3 text-right">{t('pages.targeting.averagePerParticipant')}</th>
                <th className="px-4 py-3 text-right">{t('pages.targeting.lastDailyGrowth')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedFleetTournamentData.map((fleet, index) => {
                const isExpanded = String(expandedFleetId) === String(fleet.fleetId);
                return (
                  <React.Fragment key={fleet.fleetId}>
                    <tr
                      role="button"
                      tabIndex="0"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedFleetId(isExpanded ? null : fleet.fleetId)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setExpandedFleetId(isExpanded ? null : fleet.fleetId);
                        }
                      }}
                      className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${isExpanded ? 'bg-indigo-950/30' : ''}`}
                    >
                      <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-200">
                        <span className="inline-flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-indigo-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-500" />}
                          {fleet.fleetName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {fleet.participantCount}/{fleet.rosterSize || 0}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-amber-300">
                        ★ {fleet.totalStars.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-cyan-300">
                        {(fleet.participantCount ? fleet.totalStars / fleet.participantCount : 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-indigo-300">
                        +{(fleet.daily.at(-1)?.earned || 0).toLocaleString()}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" className="bg-slate-950/50 p-0">
                          <div className="max-h-96 overflow-auto p-3 sm:p-4">
                            <h3 className="mb-3 text-xs font-black text-slate-200">
                              {t('pages.targeting.participatingMembers', {
                                fleet: fleet.fleetName,
                                count: fleet.participantCount
                              })}
                            </h3>
                            <table className="w-full min-w-[700px] text-left text-[11px]">
                              <thead>
                                <tr className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                                  <th className="px-2 py-2">#</th>
                                  <th className="px-2 py-2">{t('pages.targeting.member')}</th>
                                  {fleet.daily.map((day) => (
                                    <th key={day.date} className="px-2 py-2 text-right">
                                      {t('pages.targeting.day', { day: day.day })}
                                    </th>
                                  ))}
                                  <th className="px-2 py-2 text-right">{t('pages.targeting.tournamentStars')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fleet.participants.map((member, memberIndex) => (
                                  <tr key={member.id} className="hover:bg-slate-800/30">
                                    <td className="px-2 py-2 font-mono text-slate-600">{memberIndex + 1}</td>
                                    <td className="px-2 py-2">
                                      <div className="font-bold text-slate-200">{member.name}</div>
                                      <div className="font-mono text-[8px] text-slate-600">#{member.id}</div>
                                    </td>
                                    {member.dailyStars.map((stars, dayIndex) => (
                                      <td key={dayIndex} className={`px-2 py-2 text-right font-mono ${stars > 0 ? 'font-bold text-indigo-300' : 'text-slate-700'}`}>
                                        {stars > 0 ? `+${stars.toLocaleString()}` : '—'}
                                      </td>
                                    ))}
                                    <td className="px-2 py-2 text-right font-mono font-black text-amber-300">
                                      ★ {member.tournamentStars.toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {!fleetStatsLoading && fleetTournamentData.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center font-mono text-slate-500">
                    {t('pages.targeting.noFleetsInDivision')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Target Table Card */}
      {activeTab === 'individual' && <div className="rounded-lg bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">#</th>
                {[
                  ['fleet', 'fleet'],
                  ['id', 'playerId'],
                  ['name', 'playerName'],
                  ['trophy', 'trophies'],
                  ['maxTrophy', 'highestTrophies'],
                  ['starValue', 'starValue'],
                  ['totalStars', 'totalStars'],
                  ['status', 'resultStatus']
                ].map(([sortKey, labelKey]) => (
                  <SortableHeader
                    key={sortKey}
                    label={t(`pages.targeting.columns.${labelKey}`)}
                    sortKey={sortKey}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    title={t(
                      `pages.targeting.${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'sortDescending' : 'sortAscending'}`
                    )}
                  />
                ))}
                <th className="p-4">{t('pages.targeting.columns.quickTag')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-slate-500 font-mono">
                    {t(`pages.targeting.${loading ? 'loadingData' : 'noResults'}`)}
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => {
                  const currentStatus = statuses[item.id]?.status;
                  const isSelected = selectedRowId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      onDoubleClick={() => copyPlayerName(item.name)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-950/60 font-bold' : ''
                      }`}
                    >
                      <td className="p-4 font-mono text-slate-500">{index + 1}</td>
                      <td className="p-4 font-bold text-slate-200">{item.fleet}</td>
                      <td className="p-4 font-mono text-slate-400">#{item.id}</td>
                      <td className="p-4 font-bold text-indigo-400 hover:underline">
                        {item.name}
                      </td>
                      <td className="p-4 font-mono text-slate-200">{item.trophy?.toLocaleString()}</td>
                      <td className="p-4 font-mono text-slate-400">{item.maxTrophy?.toLocaleString()}</td>
                      <td className="p-4 font-bold">
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-black text-xs">
                          <span className="text-amber-400">★</span>
                          <span>{item.starValue}</span>
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-indigo-300">{item.totalStars}</td>
                      <td className="p-4">
                        {currentStatus === 'W' && <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 font-bold"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span>{t('pages.targeting.statusWin')}</span></span>}
                        {currentStatus === 'L' && <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 font-bold"><XCircle className="w-3.5 h-3.5 text-rose-400" /><span>{t('pages.targeting.statusLoss')}</span></span>}
                        {currentStatus === 'U' && <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 font-bold"><HelpCircle className="w-3.5 h-3.5 text-amber-400" /><span>{t('pages.targeting.statusUnclear')}</span></span>}
                        {!currentStatus && <span className="text-slate-500 font-mono">{t('pages.targeting.statusUntagged')}</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'W'); }}
                            className={`px-2 py-1 rounded font-mono font-bold transition-colors ${
                              currentStatus === 'W' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                            }`}
                          >
                            W
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'L'); }}
                            className={`px-2 py-1 rounded font-mono font-bold transition-colors ${
                              currentStatus === 'L' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                            }`}
                          >
                            L
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'U'); }}
                            className={`px-2 py-1 rounded font-mono font-bold transition-colors ${
                              currentStatus === 'U' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                            }`}
                          >
                            U
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyPlayerName(item.name); }}
                            className="p-1 rounded bg-slate-950 text-slate-400 hover:text-indigo-400 transition-colors"
                            title={t('pages.targeting.copyName')}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Floating Player History Info Modal Overlay */}
      {activeHistoryPlayer && createPortal((
        <div className="player-history-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-2 backdrop-blur-md sm:p-4" onClick={() => setActiveHistoryPlayer(null)}>
          <div className="player-history-modal max-h-[calc(100dvh-1rem)] w-full max-w-4xl space-y-4 overflow-y-auto rounded-lg bg-slate-900 p-4 shadow-2xl sm:max-h-[90vh] sm:space-y-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-black text-slate-100 sm:text-xl">
                  {t('pages.targeting.historyTitle', { name: activeHistoryPlayer.name })}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('pages.targeting.playerMeta', {
                    id: activeHistoryPlayer.id,
                    fleet: activeHistoryPlayer.fleet
                  })}
                </p>
              </div>

              <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex min-h-9 shrink-0 items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    viewMode === 'chart' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>{t('pages.targeting.chart')}</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex min-h-9 shrink-0 items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>{t('pages.targeting.list')}</span>
                </button>
                {tournamentStatus.isLive && (
                  <button
                    onClick={() => setViewMode('daily')}
                    className={`flex min-h-9 shrink-0 items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      viewMode === 'daily' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                    title={t('pages.targeting.liveOnly')}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{t('pages.targeting.dailyStars')}</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveHistoryPlayer(null)}
                  className="ml-auto shrink-0 rounded-lg bg-slate-950 p-2 text-slate-400 hover:text-white"
                  aria-label={t('pages.targeting.closeHistory')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Name History Section */}
            <div className="rounded-lg bg-slate-950 p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300">
                {t('pages.targeting.renameHistory', { count: pastNames.length })}
              </h4>
              <div className="flex flex-wrap gap-2">
                {pastNames.map((name, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 text-slate-200">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* History Content */}
            {viewMode !== 'daily' && historyLoading ? (
              <div className="text-center py-12 text-slate-400 font-mono">
                {t('pages.targeting.historyLoading')}
              </div>
            ) : viewMode !== 'daily' && historyData.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-mono bg-slate-950 rounded-lg">
                {t('pages.targeting.historyEmpty', { id: activeHistoryPlayer.id })}
              </div>
            ) : (
              <div>
                {viewMode === 'daily' ? (
                  <div className="space-y-4 rounded-lg bg-slate-950 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-black text-slate-100">
                          <Trophy className="h-4 w-4 text-amber-400" />
                          {t('pages.targeting.dailyTitle')}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400">
                          {t('pages.targeting.dailyDescription', { day: tournamentStatus.currentDay })}
                        </p>
                        <p className="mt-1 text-[10px] font-mono text-cyan-400/80">
                          {t('pages.targeting.gameDayReset')}
                        </p>
                      </div>
                      {dailyStarData && (
                        <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/40 px-3 py-2 text-right">
                          <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                            {t('pages.targeting.tournamentTotal')}
                          </div>
                          <div className="font-mono text-lg font-black text-emerald-300">
                            ★ {dailyStarData.tournamentStars.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {dailyStarsLoading ? (
                      <div className="py-12 text-center font-mono text-xs text-slate-400">
                        {t('pages.targeting.dailyLoading')}
                      </div>
                    ) : !dailyStarData ? (
                      <div className="rounded-lg border border-dashed border-slate-800 py-10 text-center text-xs text-slate-500">
                        {t('pages.targeting.dailyEmpty')}
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {dailyStarData.dailyStars.map(({ day, date, earned }) => (
                          <div key={day} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-200">
                                {t('pages.targeting.day', { day })}
                              </span>
                              <span className="font-mono text-[9px] text-slate-500">{date}</span>
                            </div>
                            <div className={`mt-2 font-mono text-2xl font-black ${earned > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                              +{earned.toLocaleString()} ★
                            </div>
                            <div className="mt-1 text-[9px] uppercase tracking-wider text-slate-500">
                              {t('pages.targeting.earned')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : viewMode === 'chart' ? (
                  <HistoryLineChart data={historyData} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 font-bold">
                          <th className="p-3">{t('pages.targeting.historyColumns.snapshotTime')}</th>
                          <th className="p-3">{t('pages.targeting.historyColumns.fleet')}</th>
                          <th className="p-3">{t('pages.targeting.historyColumns.division')}</th>
                          <th className="p-3">{t('pages.targeting.historyColumns.trophies')}</th>
                          <th className="p-3">{t('pages.targeting.historyColumns.totalStars')}</th>
                          <th className="p-3">{t('pages.targeting.historyColumns.starValue')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {historyData.map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-950/60">
                            <td className="p-3 text-slate-300">{h.date}</td>
                            <td className="p-3 font-bold text-indigo-300">{h.fleetName}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-bold">
                                {h.division}
                              </span>
                            </td>
                            <td className="p-3 text-amber-400">🏆 {h.trophy.toLocaleString()}</td>
                            <td className="p-3 text-indigo-400">★ {h.totalStars}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold">
                                ★ {h.starValue}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ), document.body)}
    </div>
  );
};

export default StarTargeting;
