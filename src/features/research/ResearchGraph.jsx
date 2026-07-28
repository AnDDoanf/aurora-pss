import React from 'react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function ResearchGraph({ currentResearch, allResearch, onSelectResearch }) {
  if (!currentResearch) return null;

  // Find prerequisite research items
  const parentId = currentResearch.RequiredResearchDesignId;
  const parent = allResearch.find(r => r.ResearchDesignId === parentId);

  // Find research items unlocked by this item
  const children = allResearch.filter(r => r.RequiredResearchDesignId === currentResearch.ResearchDesignId);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4 overflow-x-auto">
      <h3 className="text-sm font-bold text-slate-200">Prerequisite & Dependency Chain</h3>

      <div className="flex items-center justify-center space-x-8 min-w-[500px]">
        {/* Parent Node */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 mb-1 font-semibold uppercase">Prerequisite</span>
          {parent ? (
            <button
              onClick={() => onSelectResearch(parent.ResearchDesignId)}
              className="flex items-center space-x-2 p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-colors text-left"
            >
              <SpriteFrame spriteId={parent.SpriteId} size="sm" />
              <div>
                <div className="text-xs font-bold text-slate-100">{parent.ResearchName}</div>
                <div className="text-[10px] text-slate-400">ID: {parent.ResearchDesignId}</div>
              </div>
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-500 font-mono">
              None (Root Node)
            </div>
          )}
        </div>

        {/* Arrow */}
        <svg className="w-8 h-8 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>

        {/* Current Node */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-emerald-400 mb-1 font-semibold uppercase">Selected Node</span>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-emerald-950/80 border-2 border-emerald-500 text-left shadow-lg">
            <SpriteFrame spriteId={currentResearch.SpriteId} size="sm" />
            <div>
              <div className="text-xs font-bold text-slate-100">{currentResearch.ResearchName}</div>
              <div className="text-[10px] text-emerald-300 font-mono">ID: {currentResearch.ResearchDesignId}</div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <svg className="w-8 h-8 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>

        {/* Children Nodes */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 mb-1 font-semibold uppercase">Unlocks ({children.length})</span>
          {children.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {children.slice(0, 3).map(ch => (
                <button
                  key={ch.ResearchDesignId}
                  onClick={() => onSelectResearch(ch.ResearchDesignId)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-colors text-left"
                >
                  <SpriteFrame spriteId={ch.SpriteId} size="sm" />
                  <div>
                    <div className="text-xs font-bold text-slate-100">{ch.ResearchName}</div>
                    <div className="text-[10px] text-slate-400">ID: {ch.ResearchDesignId}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-500 font-mono">
              Terminal Leaf
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
