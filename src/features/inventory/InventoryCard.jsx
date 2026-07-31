import React from 'react';
import { CopyPlus, Sparkles, Trash2 } from 'lucide-react';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

const ABILITY_SPRITES = {
  DeductReload: 2703,
  HealSelfHp: 2707,
  HealSameRoomCharacters: 2705,
  AddReload: 2703,
  DamageToRoom: 2710,
  HealRoomHp: 2709,
  DamageToSameRoomCharacters: 2706,
  DamageToCurrentEnemy: 2708,
  FireWalk: 5389,
  Freeze: 5390,
  Bloodlust: 13866,
  SetFire: 5388,
  ProtectRoom: 13320,
  Invulnerability: 13319,
  PoisonCrew: 2706,
  SelfDestruct: 21296
};

export function InventoryCard({
  entry,
  crew,
  copyNumber,
  slots,
  stats,
  spent,
  capacity,
  itemById,
  formatNumber,
  t,
  onOpen,
  onDuplicate,
  onRemove
}) {
  const abilitySpriteId = ABILITY_SPRITES[crew.specialAbilityType];

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  const renderEquipmentSlot = (slot) => {
    const selectedItem = itemById.get(String(entry.equipment?.[slot.key] || ''));
    const secondary = entry.secondaryStats?.[slot.key];
    return (
      <div
        key={slot.key}
        title={selectedItem
          ? `${selectedItem.name}${secondary?.statKey && secondary?.value ? ` · ${secondary.statKey.toUpperCase()} +${secondary.value}` : ''}`
          : t(`pages.inventory.slots.${slot.key}`)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-md border ${
          selectedItem
            ? 'border-indigo-500/30 bg-indigo-500/10'
            : 'border-dashed border-slate-700 bg-slate-950/50'
        }`}
      >
        {selectedItem ? (
          <SpriteFrame
            spriteId={selectedItem.imageSpriteId}
            alt={selectedItem.name}
            size="sm"
            borderless
          />
        ) : (
          <span className="text-[8px] font-black uppercase text-slate-600">
            {t(`pages.inventory.slotAbbreviations.${slot.key}`)}
          </span>
        )}
        {secondary?.statKey && Number(secondary.value) > 0 && (
          <span className="absolute -right-1 -top-1 rounded bg-amber-500 px-1 font-mono text-[7px] font-black text-slate-950">
            +{formatNumber(secondary.value)}
          </span>
        )}
      </div>
    );
  };

  return (
    <article
      role="button"
      tabIndex="0"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      className="group min-w-0 cursor-pointer overflow-hidden rounded-lg bg-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
    >
      <div className="relative grid h-52 grid-cols-[minmax(0,1fr)_112px] gap-3 overflow-hidden bg-slate-950/60 p-3">
        <div className="flex min-w-0 items-center justify-center overflow-hidden">
          <SpriteFrame
            spriteId={crew.profileSpriteId}
            alt={crew.name}
            size="full"
            borderless
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex min-h-0 flex-col items-end gap-2">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-slate-900/90 shadow-lg backdrop-blur"
            title={crew.specialAbilityType || t('pages.inventory.noAbility')}
          >
            {abilitySpriteId ? (
              <SpriteFrame spriteId={abilitySpriteId} alt={crew.specialAbilityType} size="xs" borderless />
            ) : (
              <Sparkles className="h-5 w-5 text-slate-500" />
            )}
          </div>
          <div className="grid w-full grid-cols-2 content-start justify-items-end gap-2">
            {slots.map(renderEquipmentSlot)}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center bg-slate-950/90 p-3 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
          <div className="grid w-full grid-cols-5 gap-1.5">
            {stats.map((stat) => (
              <div key={stat.key} className="rounded-md bg-slate-900/90 px-1.5 py-2 text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <SpriteFrame spriteId={stat.spriteId} alt="" size="xxs" borderless />
                  <span className="text-[8px] font-black text-slate-500">{stat.label}</span>
                </div>
                <div className="mt-0.5 font-mono text-xs font-black text-slate-100">{formatNumber(stat.total)}</div>
                {stat.equipmentBonus > 0 && (
                  <div className="font-mono text-[7px] font-bold text-emerald-400">+{formatNumber(stat.equipmentBonus)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden border-t border-slate-800 p-3">
        <div className="flex min-h-10 flex-wrap gap-1.5">
          {slots.length === 0 ? (
            <div className="w-full rounded-md border border-dashed border-slate-700 px-2 py-2 text-center text-[9px] text-slate-500">
              {t('pages.inventory.noSlots')}
            </div>
          ) : slots.map((slot) => {
            const selectedItem = itemById.get(String(entry.equipment?.[slot.key] || ''));
            const secondary = entry.secondaryStats?.[slot.key];
            return (
              <div
                key={slot.key}
                title={selectedItem
                  ? `${selectedItem.name}${secondary?.statKey && secondary?.value ? ` · ${secondary.statKey.toUpperCase()} +${secondary.value}` : ''}`
                  : t(`pages.inventory.slots.${slot.key}`)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-md border ${
                  selectedItem
                    ? 'border-indigo-500/30 bg-indigo-500/10'
                    : 'border-dashed border-slate-700 bg-slate-950/50'
                }`}
              >
                {selectedItem ? (
                  <SpriteFrame
                    spriteId={selectedItem.imageSpriteId}
                    alt={selectedItem.name}
                    size="xs"
                    borderless
                    className="h-full w-full"
                  />
                ) : (
                  <span className="text-[8px] font-black uppercase text-slate-600">
                    {t(`pages.inventory.slotAbbreviations.${slot.key}`)}
                  </span>
                )}
                {secondary?.statKey && Number(secondary.value) > 0 && (
                  <span className="absolute -right-1 -top-1 rounded bg-amber-500 px-1 font-mono text-[7px] font-black text-slate-950">
                    +{formatNumber(secondary.value)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="flex items-center gap-2 border-t border-slate-800 px-3 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-black text-slate-100">{entry.nickname || crew.name}</h2>
            <RarityBadge rarity={crew.rarity} />
          </div>
          <p className="mt-1 truncate font-mono text-[9px] text-slate-500">
            {t('pages.inventory.trainingUsed', { spent, capacity })} · {t('pages.inventory.copyNumber', { number: copyNumber })}
          </p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate();
          }}
          title={t('pages.inventory.duplicate')}
          className="rounded-lg bg-slate-950 p-2 text-slate-400 transition hover:text-indigo-300"
        >
          <CopyPlus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (window.confirm(t('pages.inventory.removeConfirm', {
              name: entry.nickname || crew.name
            }))) {
              onRemove();
            }
          }}
          title={t('pages.inventory.remove')}
          className="rounded-lg bg-slate-950 p-2 text-slate-400 transition hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </footer>
    </article>
  );
}
