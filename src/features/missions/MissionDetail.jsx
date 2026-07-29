import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye, EyeOff, ShieldAlert, Gift } from 'lucide-react';
import { CategoryBadge } from '../../components/ui/CategoryBadge';

export function MissionDetail() {
  const { lang, id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSpoilers, setShowSpoilers] = useState(false);

  useEffect(() => {
    fetch('/data/active/missions.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(m => String(m.MissionDesignId) === String(id));
        setMission(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading mission details...</div>;
  if (!mission) return <div className="p-8 text-center text-rose-400">Mission design #{id} not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <Link 
        to={`/${lang}/library/missions`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Mission Catalog</span>
      </Link>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-xl font-extrabold text-slate-100 sm:text-3xl">{mission.MissionTitle || 'Story Mission'}</h1>
              <CategoryBadge category={mission.MissionType || 'Campaign'} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mission Design ID: <span className="font-mono text-slate-300">#{mission.MissionDesignId}</span>
            </p>
          </div>

          <button
            onClick={() => setShowSpoilers(p => !p)}
            className={`flex min-h-10 w-full items-center justify-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors sm:w-auto ${
              showSpoilers ? 'bg-amber-950/60 border-amber-800 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {showSpoilers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showSpoilers ? 'Hide Story Spoilers' : 'Reveal Dialogue Spoilers'}</span>
          </button>
        </div>

        {/* Mission Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Min Ship Level</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">Level {mission.MinShipLevel || 1}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Mission Type</div>
            <div className="text-sm font-bold text-slate-100 mt-1">{mission.MissionType || 'Campaign'}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Stars Required</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{mission.StarRequirement || 0}</div>
          </div>
        </div>

        {/* Story Dialogue Section (Spoiler Protected) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span>Mission Description & Narrative Dialogue</span>
          </h2>

          <div className={`p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed transition-all ${
            !showSpoilers ? 'blur-sm select-none opacity-40' : 'opacity-100'
          }`}>
            <p>{mission.MissionDescription || 'No description available for this mission node.'}</p>
            {mission.DialogueString && (
              <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-emerald-300">
                <strong>Dialogue Script:</strong> {mission.DialogueString}
              </div>
            )}
          </div>

          {!showSpoilers && (
            <div className="text-center text-xs text-slate-500">
              Dialogue text blurred to prevent story spoilers. Click the button above to reveal.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
