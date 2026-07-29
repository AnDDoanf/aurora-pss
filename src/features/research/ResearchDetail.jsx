import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Clock, Coins, Network } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { ResearchGraph } from './ResearchGraph';

export function ResearchDetail() {
  const { lang, id } = useParams();
  const navigate = useNavigate();
  const [allResearch, setAllResearch] = useState([]);
  const [research, setResearch] = useState(null);
  const [lineage, setLineage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/research.json')
      .then(res => res.json())
      .then(data => {
        setAllResearch(data);
        const found = data.find(r => String(r.ResearchDesignId) === String(id));
        if (found) {
          setResearch(found);
          const rootId = found.RootResearchDesignId || found.ResearchDesignId;
          const related = data.filter(r => (r.RootResearchDesignId || r.ResearchDesignId) === rootId);
          related.sort((a, b) => a.ResearchDesignId - b.ResearchDesignId);
          setLineage(related);
        } else {
          setResearch(null);
          setLineage([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading research details...</div>;
  if (!research) return <div className="p-8 text-center text-rose-400">Research technology #{id} not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <Link 
        to={`/${lang}/library/research`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Research Catalog</span>
      </Link>

      {/* Level selector */}
      {lineage.length > 1 && (
        <div className="flex flex-wrap gap-1.5 items-center p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-2">Research Levels:</span>
          {lineage.map(r => {
            const isActive = String(r.ResearchDesignId) === String(id);
            const levelMatch = (r.ResearchName || '').match(/Lv\s*(\d+)/i);
            const levelLabel = levelMatch ? `Lv ${levelMatch[1]}` : `Lv ${r.ResearchDesignId}`;
            return (
              <button
                key={r.ResearchDesignId}
                onClick={() => navigate(`/${lang}/library/research/${r.ResearchDesignId}`)}
                className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {levelLabel}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <SpriteFrame spriteId={research.SpriteId} alt={research.ResearchName} size="xl" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="break-words text-xl font-extrabold text-slate-100 sm:text-3xl">{research.ResearchName || 'Research Node'}</h1>
                <CategoryBadge category={research.ResearchType || 'General'} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Research Design ID: <span className="font-mono text-slate-300">#{research.ResearchDesignId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Gas Cost</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{research.GasCost?.toLocaleString() || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Starbux Cost</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{research.StarbuxCost || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Research Time</div>
            <div className="text-lg font-bold text-sky-400 mt-1">{Math.round((research.ResearchTime || 0) / 60)} min</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Required Lab Level</div>
            <div className="text-lg font-bold text-purple-400 mt-1">Lab Lv {research.RequiredLabLevel || 1}</div>
          </div>
        </div>

        {/* Prerequisite Node Graph */}
        <ResearchGraph
          currentResearch={research}
          allResearch={allResearch}
          onSelectResearch={(targetId) => navigate(`/${lang}/library/research/${targetId}`)}
        />
      </div>
    </div>
  );
}
