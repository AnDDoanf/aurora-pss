import React, { useState, useEffect } from 'react';
import { getTournamentStatus, getAllianceRankingsWithDivisions } from '../services/pssPublicApi';
import { getAllianceTournamentProgression } from '../services/fleetDataApi';
import { Trophy, Star, Shield, Award, RefreshCw, Calendar, Flame, Users, X, ChevronRight, Activity } from 'lucide-react';

const Tournaments = () => {
  const [activeDivision, setActiveDivision] = useState('Div A');
  const [loading, setLoading] = useState(false);
  const [divisionsData, setDivisionsData] = useState({
    'Div A': [],
    'Div B': [],
    'Div C': [],
    'Div D': []
  });
  const [tourneyStatus, setTourneyStatus] = useState(getTournamentStatus());
  
  // Selected Fleet Member Progression Modal State
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [fleetMembers, setFleetMembers] = useState([]);
  const [tournamentDays, setTournamentDays] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const divisions = ['Div A', 'Div B', 'Div C', 'Div D'];

  const loadData = async () => {
    setLoading(true);
    try {
      const status = getTournamentStatus();
      setTourneyStatus(status);

      const rankings = await getAllianceRankingsWithDivisions(0, 100);
      setDivisionsData(rankings);
    } catch (err) {
      console.error("Failed to load tournament standings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInspectFleet = async (fleetObj) => {
    setSelectedFleet(fleetObj);
    setMembersLoading(true);
    try {
      const progression = await getAllianceTournamentProgression(
        fleetObj.id,
        fleetObj.fleet,
        tourneyStatus
      );
      setFleetMembers(progression.members);
      setTournamentDays(progression.days);
    } catch (err) {
      console.error("Failed to fetch fleet members:", err);
      setFleetMembers([]);
      setTournamentDays([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const currentList = divisionsData[activeDivision] || [];
  const divisionLeader = currentList[0];

  return (
    <div className="tab-container">
      {/* Header Card */}
      <div className="card">
        <div className="card-body">
          <div className="flex-between flex-wrap gap-4 mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`status-tag ${tourneyStatus.isLive ? 'status-win border-emerald-500' : 'status-unclear'}`}>
                  {tourneyStatus.isLive ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2"></span>
                      {tourneyStatus.statusLabel}
                    </span>
                  ) : (
                    <span>{tourneyStatus.statusLabel}</span>
                  )}
                </span>
              </div>
              <h2 className="card-title flex items-center mt-2">
                <Trophy className="w-6 h-6 mr-2 text-amber-400" />
                Monthly Tournament Dashboard
              </h2>
              <p className="card-subtitle">
                Captures live star counts and user star progression during <strong>Tournament Week (the last 7 days of every month)</strong>. If the tournament is over, results reflect data from the latest completed tournament collection.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={loadData} className="btn btn-primary text-xs py-2 px-3" disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Standings</span>
              </button>
            </div>
          </div>

          {/* Division Selector Pills */}
          <div className="flex-between flex-wrap gap-3 border-t border-slate-700/60 pt-4">
            <div className="division-pill-group">
              {divisions.map(div => (
                <button
                  key={div}
                  onClick={() => setActiveDivision(div)}
                  className={`btn-pill ${activeDivision === div ? 'active' : ''}`}
                >
                  <Shield className="w-3.5 h-3.5 inline mr-1" />
                  {div} ({divisionsData[div]?.length || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stat Box Grid */}
          <div className="profile-stat-grid mt-4">
            <div className="stat-box">
              <span className="stat-label">Tournament Status</span>
              <span className="stat-value text-emerald-400">
                {tourneyStatus.isLive ? `Day ${tourneyStatus.currentDay} / 7 Active` : 'Completed'}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Active Division</span>
              <span className="stat-value text-indigo-400">{activeDivision}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Division Leader</span>
              <span className="stat-value text-amber-400">{divisionLeader?.fleet || 'N/A'}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Leader Stars</span>
              <span className="stat-value text-emerald-400">★ {divisionLeader?.stars?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Standings & Daily Star Progression Table */}
      <div className="card table-card">
        <div className="card-header flex-between">
          <h3 className="card-title">{activeDivision} Tournament Fleet Standings</h3>
          <span className="text-xs text-muted">Click any fleet row to inspect user-by-user daily star progression.</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Fleet / Alliance</th>
                <th>Total Stars</th>
                <th>Roster</th>
                <th>Avg Trophy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-muted">
                    {loading ? 'Fetching division rankings and collection data...' : 'No fleets found in this division.'}
                  </td>
                </tr>
              ) : (
                currentList.map((row) => {
                  const totalStars = row.stars || 0;

                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleInspectFleet(row)}
                      className="table-row cursor-pointer"
                    >
                      <td className="font-bold">
                        {row.rank === 1 && <Award className="w-5 h-5 inline mr-1 text-amber-400" />}
                        {row.rank === 2 && <Award className="w-5 h-5 inline mr-1 text-slate-300" />}
                        {row.rank === 3 && <Award className="w-5 h-5 inline mr-1 text-amber-600" />}
                        #{row.rank}
                      </td>
                      <td className="font-bold text-emerald-400">{row.fleet}</td>
                      <td>
                        <span className="star-pill">
                          ★ {totalStars.toLocaleString()}
                        </span>
                      </td>
                      <td>{row.members} / 100</td>
                      <td className="text-muted">🏆 {row.trophyAvg?.toLocaleString()}</td>
                      <td>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleInspectFleet(row); }}
                          className="btn btn-outline py-1 px-2.5 text-xs flex items-center"
                        >
                          <Users className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                          <span>User Stars</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Fleet User Star Progression Modal Overlay */}
      {selectedFleet && (
        <div className="modal-backdrop" onClick={() => setSelectedFleet(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="modal-title text-emerald-400 text-lg font-bold">
                    {selectedFleet.fleet} — User Star Progression
                  </h3>
                  <p className="text-xs text-muted">
                    Division: <strong>{activeDivision}</strong> • Fleet Rank: <strong>#{selectedFleet.rank}</strong> • Roster: <strong>{fleetMembers.length || selectedFleet.members} / 100 Members</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFleet(null)}
                className="btn btn-outline py-1 px-3 text-xs flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Close Modal
              </button>
            </div>

            <div className="modal-body">
              {/* Stat Boxes */}
              <div className="profile-stat-grid mb-6">
                <div className="stat-box">
                  <span className="stat-label">Fleet Stars</span>
                  <span className="stat-value text-emerald-400">★ {selectedFleet.stars?.toLocaleString()}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Fleet Trophies</span>
                  <span className="stat-value text-amber-400">🏆 {selectedFleet.trophy?.toLocaleString()}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Active Members</span>
                  <span className="stat-value text-indigo-300">{fleetMembers.length || selectedFleet.members} / 100</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Tournament Status</span>
                  <span className="stat-value text-slate-300">{tourneyStatus.isLive ? `Day ${tourneyStatus.currentDay} Active` : 'Completed'}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-indigo-400" />
                Member Stars Earned Each Day (Day 1 → Day {tournamentDays.length}):
              </h4>

              {membersLoading ? (
                <div className="text-center py-12 text-muted">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                  Fetching live fleet member roster and star progression from FleetData collection...
                </div>
              ) : fleetMembers.length === 0 ? (
                <div className="text-center py-10 text-muted border border-dashed border-slate-700 rounded-lg">
                  No member data returned for {selectedFleet.fleet}.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table text-sm">
                    <thead>
                      <tr>
                        <th>Member Rank</th>
                        <th>Player Name</th>
                        <th>Player ID</th>
                        <th>Trophy</th>
                        {tournamentDays.map(({ day, date }) => (
                          <th key={day} title={date}>Day {day} Stars</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fleetMembers.map((m, idx) => (
                        <tr key={m.id || idx} className="table-row">
                          <td className="font-mono text-xs font-bold text-slate-400">#{idx + 1}</td>
                          <td className="font-semibold text-emerald-400">{m.name}</td>
                          <td className="font-mono text-xs text-muted">{m.id}</td>
                          <td>🏆 {m.trophy?.toLocaleString()}</td>
                          {m.dailyStars.map(({ day, earned }) => (
                            <td
                              key={day}
                              className="font-mono text-xs text-slate-300"
                            >
                              ★ {earned.toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <span className="text-xs text-muted">
                Source: Live Tournament Collection (<code>fleetdata.dolores2.xyz</code>)
              </span>
              <button
                onClick={() => setSelectedFleet(null)}
                className="btn btn-primary text-xs py-1.5 px-4"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
