import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getRunningCollectionId, getAllianceDataFromCollection, getUserHistory } from '../services/fleetDataApi';
import { getDivisionAlliances } from '../services/pssPublicApi';
import { getTargetStatuses, setTargetStatus, exportToCSV } from '../services/storageService';
import { Search, Download, RefreshCw, CheckCircle, XCircle, HelpCircle, Copy, History, X, Trophy, LineChart, List, Tag, Shield } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

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
  const { lang } = useTranslation();
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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const loadStarData = async () => {
    setLoading(true);
    try {
      const collectionId = await getRunningCollectionId();
      const divAlliances = await getDivisionAlliances(0, 6);
      setAlliances(divAlliances);

      let allPlayers = [];
      if (collectionId && divAlliances.length > 0) {
        for (const alliance of divAlliances) {
          const players = await getAllianceDataFromCollection(collectionId, alliance.alliance_id, alliance.alliance_name);
          allPlayers = [...allPlayers, ...players];
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
    } catch (err) {
      console.error("Failed to load star data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStarData();
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
    setHistoryLoading(true);
    try {
      const res = await getUserHistory(player.id);
      setHistoryData(res.historyList || []);
      setPastNames(res.pastNames || [player.name]);
    } catch (err) {
      console.error("Failed to fetch user history:", err);
      setHistoryData([]);
      setPastNames([player.name]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchFleet = selectedFleet === 'ALL' || item.fleet === selectedFleet;
      const matchTrophy = item.trophy >= minTrophy && item.trophy <= maxTrophy;
      return matchName && matchFleet && matchTrophy;
    });
  }, [data, searchName, selectedFleet, minTrophy, maxTrophy]);

  const fleetOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map(d => d.fleet)));
    return ['ALL', ...unique];
  }, [data]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg shadow-xl text-xs animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header Card - Borders removed */}
      <div className="rounded-lg bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
              {lang === 'vi' ? 'Công Cụ Tính Toán Star Targeting' : 'Star Targeting Tracker'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadStarData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{lang === 'vi' ? 'Cập Nhật Dữ Liệu' : 'Refresh Data'}</span>
            </button>
            <button
              onClick={() => exportToCSV(filteredData.map(d => ({ ...d, status: statuses[d.id]?.status })))}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-all"
            >
              <Download className="h-4 w-4 text-indigo-400" />
              <span>{lang === 'vi' ? 'Xuất Báo Cáo CSV' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

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
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Hạm Đội (Fleet)</th>
                <th className="p-4">ID Thuyền Trưởng</th>
                <th className="p-4">Tên Thuyền Trưởng</th>
                <th className="p-4">Số Cúp (Trophies)</th>
                <th className="p-4">Cúp Cao Nhất</th>
                <th className="p-4">Giá Trị Sao</th>
                <th className="p-4">Tổng Sao tích lũy</th>
                <th className="p-4">Trạng Thái Kết Quả</th>
                <th className="p-4">Thao Tác Fast Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-500 font-mono">
                    {loading ? 'Đang tải dữ liệu trực tiếp từ máy chủ FleetData archive...' : 'Không tìm thấy kết quả phù hợp với bộ lọc.'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveHistoryPlayer(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-100">
                  {activeHistoryPlayer.name} — Lịch Sử Thi Đấu & Thông Tin
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Player ID: <code className="text-slate-200">#{activeHistoryPlayer.id}</code> • Hạm Đội Active: <strong className="text-indigo-400">{activeHistoryPlayer.fleet}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${
                    viewMode === 'chart' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Biểu Đồ</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Danh Sách</span>
                </button>
                <button
                  onClick={() => setActiveHistoryPlayer(null)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white"
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
            {historyLoading ? (
              <div className="text-center py-12 text-slate-400 font-mono">
                Đang truy xuất lịch sử giải đấu từ lưu trữ FleetData...
              </div>
            ) : historyData.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-mono bg-slate-950 rounded-lg">
                Không tìm thấy bản ghi giải đấu cũ cho thuyền trưởng #{activeHistoryPlayer.id}.
              </div>
            ) : (
              <div>
                {viewMode === 'chart' ? (
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
