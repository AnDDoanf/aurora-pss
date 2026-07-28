import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { CategoryBadge } from '../../components/ui/CategoryBadge';

export function ItemDetail() {
  const { lang, id } = useParams();
  const [item, setItem] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(id);

  useEffect(() => {
    fetch('/data/active/items.json')
      .then(res => res.json())
      .then(data => {
        setAllItems(data);
        const found = data.find(i => String(i.id) === String(id));
        setItem(found || null);
        setActiveId(id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleLevelChange = (targetId) => {
    const found = allItems.find(i => String(i.id) === String(targetId));
    if (found) {
      setItem(found);
      setActiveId(targetId);
    }
  };

  // Group droids family members
  let familyLevels = [];
  if (item && item.itemType === 'Android') {
    const baseName = item.name.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
    
    const romanToNum = (roman) => {
      const map = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
      return map[roman.toLowerCase()] || 1;
    };

    familyLevels = allItems.filter(i => 
      i.itemType === 'Android' && 
      i.name.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim() === baseName
    ).sort((a, b) => {
      const matchA = a.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
      const matchB = b.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
      const lvlA = matchA ? romanToNum(matchA[1]) : 1;
      const lvlB = matchB ? romanToNum(matchB[1]) : 1;
      return lvlA - lvlB;
    });
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading item details...</div>;
  if (!item) return <div className="p-8 text-center text-rose-400">Item #{id} not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      <Link 
        to={`/${lang}/library/items`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Item Catalog</span>
      </Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <SpriteFrame spriteId={item.imageSpriteId} alt={item.name} size="xl" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{item.name}</h1>
                <RarityBadge rarity={item.rarity} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Item Design ID: <span className="font-mono text-slate-300">#{item.id}</span> • Type: <span className="font-mono text-slate-300">{item.itemType} ({item.itemSubType})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Droid Grade/Level Selector */}
        {familyLevels.length > 1 && (
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-semibold text-emerald-400">
              Select Droid Grade / Level
            </div>
            <div className="flex flex-wrap gap-2">
              {familyLevels.map(lvlItem => {
                const match = lvlItem.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
                const gradeLabel = match ? match[1] : 'Base';
                const isActive = String(lvlItem.id) === String(activeId);

                return (
                  <button
                    key={lvlItem.id}
                    onClick={() => handleLevelChange(lvlItem.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      isActive 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50'
                    }`}
                  >
                    Grade {gradeLabel} (Rank {lvlItem.rank || 0})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Item Rank</div>
            <div className="text-lg font-bold text-slate-100 mt-1">Rank {item.rank || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Enhancement Type</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">{item.enhancementType || 'None'}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Enhance Boost</div>
            <div className="text-lg font-bold text-purple-400 mt-1">{item.enhancementValue ? `+${item.enhancementValue}` : '0'}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Official Fair Price</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{item.fairPrice?.toLocaleString() || 0}</div>
          </div>
        </div>

        {/* Third-Party Market Adapter Section */}
        <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="h-4 w-4" />
            <span>Third-Party Live Market Data (PixyShip & FleetData Adapter)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Marketplace history and player sales data are supplied by independent third-party market aggregators. Official catalog facts and live marketplace observations are isolated.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-amber-900/40 font-mono">
            <span>Market Status: Active</span>
            <span>Est. Fair Value: {item.fairPrice || 0} Starbux / Minerals</span>
          </div>
        </div>

      </div>

    </div>
  );
}
