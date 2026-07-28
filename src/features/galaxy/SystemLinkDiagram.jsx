import React from 'react';

export function SystemLinkDiagram({ currentSystem, allSystems, systemLinks }) {
  if (!currentSystem || !systemLinks) return null;

  // Find linked star system IDs
  const cId = currentSystem.StarSystemId;
  const connectedLinks = systemLinks.filter(l => l.FromStarSystemId === cId || l.ToStarSystemId === cId);
  const neighborIds = connectedLinks.map(l => l.FromStarSystemId === cId ? l.ToStarSystemId : l.FromStarSystemId);
  const neighbors = allSystems.filter(s => neighborIds.includes(s.StarSystemId));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4 overflow-x-auto">
      <h3 className="text-sm font-bold text-slate-200">Star System Connectivity Links</h3>

      <div className="flex items-center justify-center space-x-12 py-4 min-w-[500px]">
        {/* Current System Node */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
            <span className="font-mono text-xs font-bold">#{cId}</span>
          </div>
          <div className="text-xs font-bold text-slate-100 mt-2">{currentSystem.StarSystemName || 'System'}</div>
          <div className="text-[10px] text-emerald-400">Current Node</div>
        </div>

        {/* Connected Neighbor Systems */}
        <div className="flex flex-col space-y-3">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">Connected Jump Routes ({neighbors.length})</span>
          {neighbors.length > 0 ? (
            neighbors.map(n => (
              <div key={n.StarSystemId} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-300">
                  #{n.StarSystemId}
                </div>
                <div className="text-xs font-semibold text-slate-200">{n.StarSystemName}</div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 font-mono">Isolated System</div>
          )}
        </div>
      </div>
    </div>
  );
}
