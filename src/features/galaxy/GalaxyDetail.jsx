import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, MapPin, Compass } from 'lucide-react';
import { SystemLinkDiagram } from './SystemLinkDiagram';

export function GalaxyDetail() {
  const { lang, id } = useParams();
  const [galaxyData, setGalaxyData] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/galaxy.json')
      .then(res => res.json())
      .then(data => {
        setGalaxyData(data);
        const found = (data.starSystems || []).find(s => String(s.StarSystemId) === String(id));
        setSystem(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading star system details...</div>;
  if (!system) return <div className="p-8 text-center text-rose-400">Star system #{id} not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <Link 
        to={`/${lang}/library/galaxy`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Galaxy Catalog</span>
      </Link>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
              <Globe className="h-10 w-10" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-xl font-extrabold text-slate-100 sm:text-3xl">{system.StarSystemName || 'Star System'}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Star System ID: <span className="font-mono text-slate-300">#{system.StarSystemId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">System Level</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">Level {system.Level || 1}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">System Type</div>
            <div className="text-sm font-bold text-slate-100 mt-1">{system.SystemType || 'Normal'}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Risk Score</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{system.Risk || 0}</div>
          </div>
        </div>

        {/* System Link Connectivity Diagram */}
        <SystemLinkDiagram
          currentSystem={system}
          allSystems={galaxyData?.starSystems || []}
          systemLinks={galaxyData?.systemLinks || []}
        />
      </div>
    </div>
  );
}
