import React from 'react';
import { AlertTriangle, GitMerge } from 'lucide-react';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { getCrewHeadSpriteId } from '../../utils/crewSprites';
import { useTranslation } from '../../i18n/useTranslation';

function CrewNode({ node, crewByName, t }) {
  const crewName = node.name.replace(/\s*\(\d+\)\s*$/, '').trim();
  const crew = crewByName.get(crewName.toLowerCase());
  const isLeaf = !node.children?.length;

  return (
    <div className={`w-56 shrink-0 rounded-lg border p-2.5 shadow-sm ${
      node.missing
        ? 'border-rose-700/70 bg-rose-950/35'
        : 'border-slate-700 bg-slate-900'
    }`}>
      <div className="flex items-center gap-2.5">
        <SpriteFrame
          spriteId={getCrewHeadSpriteId(crew)}
          fallbackSpriteId={crew?.profileSpriteId}
          alt={node.name}
          size="sm"
          borderless
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-black text-slate-100" title={node.name}>{node.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {crew?.rarity && <RarityBadge rarity={crew.rarity} className="px-1.5 py-0 text-[9px]" />}
            {node.missing && (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-rose-300">
                <AlertTriangle className="h-3 w-3" /> {t('pages.prestige.missing')}
              </span>
            )}
            {isLeaf && !node.missing && <span className="text-[9px] font-bold uppercase text-emerald-400">{t('pages.prestige.ingredient')}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeBranch({ node, crewByName, t }) {
  return (
    <div className="flex min-w-max items-center">
      <CrewNode node={node} crewByName={crewByName} t={t} />
      {node.children?.length > 0 && (
        <>
          <div className="h-px w-6 shrink-0 bg-slate-700" aria-hidden="true" />
          <div className="relative space-y-3 border-l border-slate-700 py-2 pl-6">
            {node.children.map((child, index) => (
              <div key={`${child.name}-${index}`} className="relative before:absolute before:-left-6 before:top-1/2 before:h-px before:w-6 before:bg-slate-700">
                <TreeBranch node={child} crewByName={crewByName} t={t} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PrestigeTree({ root, crewByName }) {
  const { t } = useTranslation();
  if (!root) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <GitMerge className="h-4 w-4 text-indigo-400" /> {t('pages.prestige.treeDirection')}
      </div>
      <TreeBranch node={root} crewByName={crewByName} t={t} />
    </div>
  );
}
