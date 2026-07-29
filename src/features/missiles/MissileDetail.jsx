import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function MissileDetail() {
  const { lang, id } = useParams();
  const navigate = useNavigate();
  const [missile, setMissile] = useState(null);
  const [lineage, setLineage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/missiles.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(m => String(m.MissileDesignId) === String(id));
        if (found) {
          setMissile(found);
          const rootId = found.RootMissileDesignId || found.MissileDesignId;
          const related = data.filter(m => (m.RootMissileDesignId || m.MissileDesignId) === rootId);
          related.sort((a, b) => a.MissileDesignId - b.MissileDesignId);
          setLineage(related);
        } else {
          setMissile(null);
          setLineage([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading missile details...</div>;
  if (!missile) return <div className="p-8 text-center text-rose-400">Missile design #{id} not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <Link 
        to={`/${lang}/library/missiles`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Missiles Catalog</span>
      </Link>

      {/* Level selector */}
      {lineage.length > 1 && (
        <div className="flex flex-wrap gap-1.5 items-center p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-2">Missile Levels:</span>
          {lineage.map(m => {
            const isActive = String(m.MissileDesignId) === String(id);
            const levelMatch = (m.MissileName || '').match(/Lv\s*(\d+)/i);
            const levelLabel = levelMatch ? `Lv ${levelMatch[1]}` : `Lv ${m.MissileDesignId}`;
            return (
              <button
                key={m.MissileDesignId}
                onClick={() => navigate(`/${lang}/library/missiles/${m.MissileDesignId}`)}
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
            <SpriteFrame spriteId={missile.SpriteId} alt={missile.MissileName} size="xl" />
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-xl font-extrabold text-slate-100 sm:text-3xl">{missile.MissileName || 'Ammunition Design'}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Missile Design ID: <span className="font-mono text-slate-300">#{missile.MissileDesignId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">System Damage</div>
            <div className="text-lg font-bold text-rose-400 mt-1">{missile.SystemDamage || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Shield Damage</div>
            <div className="text-lg font-bold text-sky-400 mt-1">{missile.ShieldDamage || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Crew Damage</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{missile.CharacterDamage || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Volley Size</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{missile.Volley || 1}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
