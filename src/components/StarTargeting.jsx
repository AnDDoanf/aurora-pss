import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getRunningCollectionId, getAllianceDataFromCollection, getLatestAllianceData, getUserHistory, getAllianceTournamentProgression } from '../services/fleetDataApi';
import { getDivisionAlliances, getTournamentStatus } from '../services/pssPublicApi';
import { getTargetStatuses, setTargetStatus, exportToCSV } from '../services/storageService';
import { Search, Download, RefreshCw, CheckCircle, XCircle, HelpCircle, Copy, History, X, Trophy, LineChart, List, Tag, Shield, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const HOURLY_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

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
          Biểu đồ Lịch sử Cúp & Tổng Sao (Mới nhất bên trái)
        </span>
        <span className="text-slate-400 font-mono">{sorted.length} Bản ghi • Cuộn phải để xem lịch sử cũ</span>
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
                <title>{`${d.date}\nFleet: ${d.fleetName} (${d.division})\nTrophies: ${d.trophy.toLocaleString()}\nTotal Stars: ${d.totalStars}\nCalculated Star Value: ★ ${d.starValue}`}</title>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-slate-400 pt-2">
        <span className="text-amber-400 font-medium">← Mới nhất ({sorted[0]?.date})</span>
        <span className="text-emerald-400 font-medium">★ Số trên chấm = Tổng sao • Cuộn phải để xem cũ hơn →</span>
        <span>Cũ nhất: {sorted[sorted.length - 1]?.date}</span>
      </div>
    </div>
  );
};

const StarTargeting = () => {
  const { t, lang } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [alliances, setAlliances] = useState([]);
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
  const [sortConfig, setSortConfig] = useState({
    key: 'totalStars',
    direction: 'desc'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const loadStarData = async () => {
    setLoading(true);
    try {
      const currentTournamentStatus = getTournamentStatus();
      setTournamentStatus(currentTournamentStatus);
      const divAlliances = await getDivisionAlliances(0, 6);
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

      if (allPlayers.length === 0) {
        allPlayers = [
          { fleet: 'Fleet Alpha', id: 101, name: 'CommanderX', trophy: 4850, maxTrophy: 5120, starValue: 4, totalStars: 28 },
          { fleet: 'Fleet Alpha', id: 102, name: 'StarCaptain', trophy: 5200, maxTrophy: 5300, starValue: 5, totalStars: 35 },
          { fleet: 'Fleet Beta', id: 103, name: 'VoidWalker', trophy: 3900, maxTrophy: 4100, starValue: 3, totalStars: 22 },
          { fleet: 'Fleet Beta', id: 104, name: 'NebulaKing', trophy: 6100, maxTrophy: 6250, starValue: 6, totalStars: 42 }
        ];
      }

      setData(allPlayers);
      setLastFetchedAt(sourceTimestamp || new Date());
    } catch (err) {
      console.error("Failed to load star data:", err);
    } finally {
      setLoading(false);
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
      window.clearTimeout(firstRefresh);
      if (hourlyRefresh) {
        window.clearInterval(hourlyRefresh);
      }
    };
  }, []);

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
    showToast(`Đã đánh dấu thuyền trưởng #${id} là ${newStatus === 'W' ? 'Thắng (Win)' : newStatus === 'L' ? 'Thua (Loss)' : 'Chưa rõ (Unclear)'}`);
  };

  const copyPlayerName = (name) => {
    navigator.clipboard.writeText(name);
    showToast(`Đã sao chép tên: "${name}"`);
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
              onClick={loadStarData}
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

      <div className="space-y-6 rounded-lg bg-slate-900 p-4 shadow-sm sm:p-8">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">{lang === 'vi' ? 'Tìm theo tên thuyền trưởng' : 'Search Player Name'}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'vi' ? 'Nhập tên thuyền trưởng...' : 'Filter by name...'}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-slate-950 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">{lang === 'vi' ? 'Lọc theo Hạm đội (Fleet)' : 'Filter by Fleet'}</label>
            <select
              value={selectedFleet}
              onChange={(e) => setSelectedFleet(e.target.value)}
              className="w-full bg-slate-950 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {fleetOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Cúp tối thiểu: <span className="text-indigo-400 font-mono">{minTrophy}</span></label>
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
            <label className="text-xs font-bold text-slate-300">Cúp tối đa: <span className="text-indigo-400 font-mono">{maxTrophy}</span></label>
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
          <span className="flex items-center space-x-1.5"><kbd className="px-2 py-0.5 rounded bg-slate-950 font-mono text-indigo-400 font-bold">W</kbd> <span>= {lang === 'vi' ? 'Đánh dấu Thắng' : 'Win'}</span></span>
          <span className="flex items-center space-x-1.5"><kbd className="px-2 py-0.5 rounded bg-slate-950 font-mono text-rose-400 font-bold">L</kbd> <span>= {lang === 'vi' ? 'Đánh dấu Thua' : 'Loss'}</span></span>
          <span className="flex items-center space-x-1.5"><kbd className="px-2 py-0.5 rounded bg-slate-950 font-mono text-amber-400 font-bold">U</kbd> <span>= {lang === 'vi' ? 'Đánh dấu Chưa rõ' : 'Unclear'}</span></span>
          <span className="text-slate-400 font-mono ml-auto">Mẹo: Click vào dòng để mở chi tiết lịch sử thuyền trưởng</span>
        </div>
      </div>

      {/* Target Table Card */}
      <div className="rounded-lg bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
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
                  <td colSpan="9" className="text-center py-12 text-slate-500 font-mono">
                    {loading ? 'Đang tải dữ liệu trực tiếp từ máy chủ FleetData archive...' : 'Không tìm thấy kết quả phù hợp với bộ lọc.'}
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => {
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
                        {currentStatus === 'W' && <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 font-bold"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span>Thắng</span></span>}
                        {currentStatus === 'L' && <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 font-bold"><XCircle className="w-3.5 h-3.5 text-rose-400" /><span>Thua</span></span>}
                        {currentStatus === 'U' && <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 font-bold"><HelpCircle className="w-3.5 h-3.5 text-amber-400" /><span>Chưa rõ</span></span>}
                        {!currentStatus && <span className="text-slate-500 font-mono">Chưa tag</span>}
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
                            title="Copy Name"
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
      </div>

      {/* Floating Player History Info Modal Overlay */}
      {activeHistoryPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 backdrop-blur-md sm:p-4" onClick={() => setActiveHistoryPlayer(null)}>
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-4xl space-y-4 overflow-y-auto rounded-lg bg-slate-900 p-4 shadow-2xl sm:max-h-[90vh] sm:space-y-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
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
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Name History Section */}
            <div className="rounded-lg bg-slate-950 p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300">
                Lịch sử đổi tên trong quá khứ ({pastNames.length}):
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
                Đang truy xuất lịch sử giải đấu từ lưu trữ FleetData...
              </div>
            ) : viewMode !== 'daily' && historyData.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-mono bg-slate-950 rounded-lg">
                Không tìm thấy bản ghi giải đấu cũ cho thuyền trưởng #{activeHistoryPlayer.id}.
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
                          <th className="p-3">Thời Gian Snapshot</th>
                          <th className="p-3">Hạm Đội / Alliance</th>
                          <th className="p-3">Bảng Đấu (Division)</th>
                          <th className="p-3">Số Cúp</th>
                          <th className="p-3">Tổng Sao</th>
                          <th className="p-3">Giá Trị Sao</th>
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
      )}
    </div>
  );
};

export default StarTargeting;
