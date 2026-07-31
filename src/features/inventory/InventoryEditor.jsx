import React from 'react';
import { createPortal } from 'react-dom';
import { Backpack, Dumbbell, Minus, Package, Plus, X } from 'lucide-react';
import { HoldStepButton } from '../../components/ui/HoldStepButton';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { TRAINING_STATS } from '../training/trainingCalculations';

export function InventoryEditor({
  entry,
  crew,
  capacity,
  spent,
  slots,
  statResult,
  itemsBySubtype,
  itemById,
  formatNumber,
  t,
  onClose,
  onUpdate,
  onUpdateTraining
}) {
  if (!entry || !crew) return null;

  return createPortal((
    <div
      className="inventory-editor-backdrop fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-2 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="inventory-editor-modal max-h-[calc(100dvh-1rem)] w-full max-w-4xl overflow-y-auto rounded-lg bg-slate-900 shadow-2xl sm:max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-label={t('pages.inventory.editCrew', { name: entry.nickname || crew.name })}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-start gap-3 border-b border-slate-800 bg-slate-900 p-4 sm:p-5">
          <SpriteFrame spriteId={crew.profileSpriteId} alt={crew.name} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-black text-slate-100">{entry.nickname || crew.name}</h2>
              <RarityBadge rarity={crew.rarity} />
            </div>
            <p className="mt-1 font-mono text-[10px] text-slate-500">#{crew.id} · {crew.specialAbilityType}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('pages.inventory.closeEditor')}
            className="rounded-lg bg-slate-950 p-2 text-slate-400 transition hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
              {t('pages.inventory.nickname')}
            </span>
            <input
              value={entry.nickname}
              onChange={(event) => onUpdate((current) => ({ ...current, nickname: event.target.value }))}
              placeholder={crew.name}
              className="w-full rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-bold text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </label>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <Backpack className="h-3.5 w-3.5 text-indigo-400" />
              {t('pages.inventory.totalStats')}
            </h3>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
              {statResult.stats.map((stat) => (
                <div key={stat.key} className="rounded-md bg-slate-950 px-2 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <SpriteFrame spriteId={stat.spriteId} alt="" size="xxs" borderless />
                    <span className="text-[9px] font-black text-slate-500">{stat.label}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-sm font-black text-slate-100">{formatNumber(stat.total)}</div>
                  {stat.equipmentBonus > 0 && (
                    <div className="font-mono text-[8px] font-bold text-emerald-400">+{formatNumber(stat.equipmentBonus)}</div>
                  )}
                </div>
              ))}
            </div>
            {statResult.extraBonuses.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {statResult.extraBonuses.map((bonus, index) => (
                  <span key={`${bonus.itemName}-${index}`} className="rounded-full bg-cyan-500/10 px-2 py-1 text-[9px] font-bold text-cyan-300">
                    {bonus.type} +{formatNumber(bonus.value)}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                <Dumbbell className="h-3.5 w-3.5 text-indigo-400" />
                {t('pages.inventory.training')}
              </h3>
              <span className="font-mono text-[10px] font-bold text-slate-400">
                {t('pages.inventory.trainingRemaining', {
                  remaining: Math.max(capacity - spent, 0),
                  capacity
                })}
              </span>
            </div>
            <div className="grid gap-x-5 gap-y-2 lg:grid-cols-2">
              {[TRAINING_STATS.slice(0, 5), TRAINING_STATS.slice(5)].map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-2">
                  {column.map((stat) => {
                    const value = Number(entry.training?.[stat.key]) || 0;
                    const combinedStat = statResult.stats.find((item) => item.key === stat.key);
                    const canIncrease = spent < capacity && value < capacity;

                    return (
                      <div
                        key={stat.key}
                        className="grid min-w-0 grid-cols-[34px_minmax(52px,1fr)_52px_126px] items-center gap-2"
                      >
                        <SpriteFrame spriteId={stat.spriteId} alt="" size="xs" borderless />
                        <div className="min-w-0">
                          <div className="text-sm font-black leading-none" style={{ color: stat.color }}>
                            {stat.label}
                          </div>
                          <div className="mt-1 font-mono text-sm font-black leading-none text-cyan-300">
                            {combinedStat ? formatNumber(combinedStat.total) : '—'}
                          </div>
                        </div>
                        <div className="whitespace-nowrap text-right font-mono text-[10px] font-black text-slate-500">
                          0 ~ {value}
                        </div>
                        <div className="grid grid-cols-[36px_54px_36px] overflow-hidden rounded-lg bg-slate-800 shadow-sm">
                          <HoldStepButton
                            direction={-1}
                            disabled={value <= 0}
                            onStep={(delta) => onUpdateTraining(stat.key, value + delta)}
                            className="flex h-9 items-center justify-center text-indigo-300 transition hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-30"
                            label={t('training.decrease', { stat: stat.label })}
                          >
                            <Minus className="h-4 w-4" />
                          </HoldStepButton>
                          <input
                            type="number"
                            min="0"
                            max={capacity}
                            value={value}
                            onChange={(event) => onUpdateTraining(stat.key, event.target.value)}
                            className="training-number-input training-stat-input h-9 min-w-0 px-1 text-center font-mono text-base font-black outline-none"
                            aria-label={t('pages.inventory.trainingStat', { stat: stat.label })}
                          />
                          <HoldStepButton
                            direction={1}
                            disabled={!canIncrease}
                            onStep={(delta) => onUpdateTraining(stat.key, value + delta)}
                            className="flex h-9 items-center justify-center text-indigo-300 transition hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-30"
                            label={t('training.increase', { stat: stat.label })}
                          >
                            <Plus className="h-4 w-4" />
                          </HoldStepButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <Package className="h-3.5 w-3.5 text-indigo-400" />
              {t('pages.inventory.equipment')}
            </h3>
            {slots.length === 0 ? (
              <p className="rounded-md bg-slate-950 p-3 text-xs text-slate-500">{t('pages.inventory.noSlots')}</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {slots.map((slot) => {
                  const availableItems = itemsBySubtype.get(slot.subtype) || [];
                  const selectedItem = itemById.get(String(entry.equipment?.[slot.key] || ''));
                  const isHeroEquipment = String(selectedItem?.rarity).toLowerCase() === 'hero';
                  const secondary = entry.secondaryStats?.[slot.key] || { statKey: '', value: 0 };
                  return (
                    <div key={slot.key} className="rounded-md bg-slate-950 p-2.5">
                      <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-slate-800 bg-slate-900">
                          {selectedItem ? (
                            <SpriteFrame spriteId={selectedItem.imageSpriteId} alt={selectedItem.name} size="md" borderless />
                          ) : (
                            <Package className="h-6 w-6 text-slate-600" />
                          )}
                        </div>
                        <span className="min-w-0">
                          <span className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-500">
                            {t(`pages.inventory.slots.${slot.key}`)}
                          </span>
                          <select
                            value={entry.equipment?.[slot.key] || ''}
                            aria-label={t(`pages.inventory.slots.${slot.key}`)}
                            onChange={(event) => onUpdate((current) => {
                              const secondaryStats = { ...(current.secondaryStats || {}) };
                              delete secondaryStats[slot.key];
                              return {
                                ...current,
                                equipment: { ...current.equipment, [slot.key]: event.target.value || null },
                                secondaryStats
                              };
                            })}
                            className="w-full rounded-md bg-slate-800 px-2 py-2 text-[11px] font-bold text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500/40"
                          >
                            <option value="">{t('pages.inventory.emptySlot')}</option>
                            {availableItems.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name} · {item.enhancementType && item.enhancementType !== 'None'
                                  ? `+${formatNumber(item.enhancementValue)} ${item.enhancementType}`
                                  : t('pages.inventory.noBonus')}
                              </option>
                            ))}
                          </select>
                        </span>
                      </div>

                      {isHeroEquipment && (
                        <div className="mt-2 border-t border-slate-800 pt-2">
                          <div className="mb-1.5 text-[9px] font-black uppercase tracking-wider text-amber-400">
                            {t('pages.inventory.heroSecondary')}
                          </div>
                          <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
                            <select
                              value={secondary.statKey}
                              aria-label={t('pages.inventory.secondaryStat')}
                              onChange={(event) => onUpdate((current) => ({
                                ...current,
                                secondaryStats: {
                                  ...(current.secondaryStats || {}),
                                  [slot.key]: {
                                    statKey: event.target.value,
                                    value: Number(current.secondaryStats?.[slot.key]?.value) || 0
                                  }
                                }
                              }))}
                              className="min-w-0 rounded-md bg-slate-800 px-2 py-2 text-[11px] font-bold text-slate-100 outline-none focus:ring-1 focus:ring-amber-500/40"
                            >
                              <option value="">{t('pages.inventory.selectSecondaryStat')}</option>
                              {TRAINING_STATS.map((stat) => (
                                <option key={stat.key} value={stat.key}>{stat.label}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min="0"
                              max="999"
                              step="0.1"
                              value={secondary.value || 0}
                              disabled={!secondary.statKey}
                              aria-label={t('pages.inventory.secondaryValue')}
                              onChange={(event) => onUpdate((current) => ({
                                ...current,
                                secondaryStats: {
                                  ...(current.secondaryStats || {}),
                                  [slot.key]: {
                                    statKey: current.secondaryStats?.[slot.key]?.statKey || '',
                                    value: Math.min(Math.max(Number(event.target.value) || 0, 0), 999)
                                  }
                                }
                              }))}
                              className="training-number-input rounded-md bg-slate-800 px-2 py-2 text-center font-mono text-xs font-black text-slate-100 outline-none focus:ring-1 focus:ring-amber-500/40 disabled:opacity-40"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  ), document.body);
}
