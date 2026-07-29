import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, LayoutGrid, Rocket, Package, BookOpen, ArrowRight } from 'lucide-react';
import MiniSearch from 'minisearch';
import { useTranslation } from '../../i18n/useTranslation';

export function SearchModal({ isOpen, onClose }) {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [miniSearch, setMiniSearch] = useState(null);
  const inputRef = useRef(null);

  // Initialize search index on mount
  useEffect(() => {
    async function loadIndexes() {
      try {
        const [crewRes, roomsRes, shipsRes, itemsRes] = await Promise.all([
          fetch('/data/active/crew.json').then(r => r.ok ? r.json() : []),
          fetch('/data/active/rooms.json').then(r => r.ok ? r.json() : []),
          fetch('/data/active/ships.json').then(r => r.ok ? r.json() : []),
          fetch('/data/active/items.json').then(r => r.ok ? r.json() : [])
        ]);

        const ms = new MiniSearch({
          fields: ['name', 'category', 'type', 'rarity', 'idStr'],
          storeFields: ['name', 'category', 'type', 'rarity', 'itemKind', 'targetPath', 'spriteId'],
          searchOptions: {
            fuzzy: 0.2,
            prefix: true
          }
        });

        const docs = [];

        crewRes.forEach(c => {
          docs.push({
            id: `crew_${c.id}`,
            idStr: String(c.id),
            name: c.name,
            category: c.rarity,
            type: 'Crew',
            itemKind: 'crew',
            targetPath: `/${lang}/library/crew/${c.id}`,
            spriteId: c.profileSpriteId
          });
        });

        roomsRes.forEach(r => {
          docs.push({
            id: `room_${r.rootId}`,
            idStr: String(r.rootId),
            name: r.name,
            category: r.category,
            type: r.type || 'Room',
            itemKind: 'rooms',
            targetPath: `/${lang}/library/rooms/${r.rootId}`,
            spriteId: r.levels?.[0]?.imageSpriteId
          });
        });

        shipsRes.forEach(s => {
          docs.push({
            id: `ship_${s.id}`,
            idStr: String(s.id),
            name: s.name,
            category: `Level ${s.shipLevel}`,
            type: 'Ship',
            itemKind: 'ships',
            targetPath: `/${lang}/library/ships/${s.id}`,
            spriteId: null
          });
        });

        itemsRes.forEach(i => {
          docs.push({
            id: `item_${i.id}`,
            idStr: String(i.id),
            name: i.name,
            category: i.rarity,
            type: i.itemType || 'Item',
            itemKind: 'items',
            targetPath: `/${lang}/library/items/${i.id}`,
            spriteId: i.imageSpriteId
          });
        });

        ms.addAll(docs);
        setMiniSearch(ms);
      } catch (err) {
        console.warn('Failed to load search indexes:', err);
      }
    }

    if (isOpen) {
      loadIndexes();
    }
  }, [isOpen, lang]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || !miniSearch) {
      setResults([]);
      return;
    }

    const searchHits = miniSearch.search(query).slice(0, 10);
    setResults(searchHits);
  }, [query, miniSearch]);

  if (!isOpen) return null;

  const handleSelectResult = (targetPath) => {
    onClose();
    setQuery('');
    navigate(targetPath);
  };

  const getIcon = (kind) => {
    switch (kind) {
      case 'crew': return Users;
      case 'rooms': return LayoutGrid;
      case 'ships': return Rocket;
      case 'items': return Package;
      default: return BookOpen;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm sm:px-4 sm:pt-16"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-2xl sm:max-h-[calc(100dvh-5rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        
        {/* Input header */}
        <div className="flex items-center px-4 border-b border-slate-800/40">
          <Search className="h-5 w-5 text-indigo-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full bg-transparent px-4 py-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="min-h-0 flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40 sm:max-h-96">
          {results.length > 0 ? (
            results.map((hit) => {
              const Icon = getIcon(hit.itemKind);
              return (
                <button
                  key={hit.id}
                  onClick={() => handleSelectResult(hit.targetPath)}
                  className="group flex w-full min-w-0 items-center justify-between gap-2 rounded-lg px-2 py-3 text-left text-sm transition-colors hover:bg-slate-800/70 sm:px-3"
                >
                  <div className="flex min-w-0 items-center space-x-3">
                    <div className="p-2 rounded-md bg-slate-950 text-indigo-400 group-hover:bg-indigo-950/80">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-bold text-slate-100 transition-colors group-hover:text-indigo-300">
                        {hit.name}
                      </div>
                      <div className="text-xs text-slate-400 space-x-2">
                        <span className="capitalize">{hit.type}</span>
                        {hit.category && <span>• {hit.category}</span>}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          ) : query.trim() ? (
            <div className="p-8 text-center text-sm text-slate-400">
              {t('common.noResults')}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 font-mono">
              Type crew, room, ship, or item names to search...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
