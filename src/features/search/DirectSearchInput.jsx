import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, LayoutGrid, Rocket, Package, BookOpen, ArrowRight } from 'lucide-react';
import MiniSearch from 'minisearch';
import { useTranslation } from '../../i18n/useTranslation';

export function DirectSearchInput() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [miniSearch, setMiniSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Eagerly load MiniSearch indexes on mount for instant zero-delay search
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
            targetPath: `/${lang}/library/crew/${c.id}`
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
            targetPath: `/${lang}/library/rooms/${r.rootId}`
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
            targetPath: `/${lang}/library/ships/${s.id}`
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
            targetPath: `/${lang}/library/items/${i.id}`
          });
        });

        ms.addAll(docs);
        setMiniSearch(ms);
      } catch (err) {
        console.warn('Failed to load search index:', err);
      }
    }

    loadIndexes();
  }, [lang]);

  // Listen for global Ctrl+K / Cmd+K to focus search input directly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant zero-delay query search
  useEffect(() => {
    if (!query.trim() || !miniSearch) {
      setResults([]);
      return;
    }

    const searchHits = miniSearch.search(query).slice(0, 8);
    setResults(searchHits);
    setIsOpen(true);
  }, [query, miniSearch]);

  const handleSelectResult = (targetPath) => {
    setIsOpen(false);
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
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-indigo-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('nav.searchPlaceholder')}
          className="w-full bg-slate-900 rounded-lg pl-10 pr-12 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
        />
        {query ? (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }} 
            className="absolute right-3 p-0.5 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="absolute right-2.5 hidden sm:inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 pointer-events-none">
            Ctrl K
          </kbd>
        )}
      </div>

      {/* Instant Dropdown Popover */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute left-0 top-full mt-2 w-full max-w-md rounded-lg bg-slate-950 p-2 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/40">
          {results.length > 0 ? (
            results.map((hit) => {
              const Icon = getIcon(hit.itemKind);
              return (
                <button
                  key={hit.id}
                  onClick={() => handleSelectResult(hit.targetPath)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs hover:bg-slate-900 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-slate-900 text-indigo-400 group-hover:bg-indigo-950/80">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {hit.name}
                      </div>
                      <div className="text-[10px] text-slate-400 space-x-1.5 font-mono">
                        <span className="capitalize">{hit.type}</span>
                        {hit.category && <span>• {hit.category}</span>}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          ) : query.trim() ? (
            <div className="p-4 text-center text-xs text-slate-400 font-mono">
              {t('common.noResults')}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
