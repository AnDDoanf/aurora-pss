import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Award } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { publicUrl } from '../../utils/publicUrl';

const getTechnicalPerkDescription = (col) => {
  const triggerMap = {
    AbilityUsed: 'When using an ability',
    AttackCrew: 'When attacking crew',
    Death: 'Upon death',
    Repair: 'When repairing a room',
    Constant: 'Passive effect',
    Start: 'At the start of battle',
    TakeFireDamage: 'When taking fire damage',
    Teleport: 'Upon teleporting to an enemy room',
    Stun: 'When stunned',
    CrewAction: 'When performing a crew action',
    DamageTaken: 'When taking damage',
    ChangeRoom: 'When moving to a different room',
    TakeDamage: 'When taking damage'
  };

  const effectMap = {
    RefreshAbility: 'gain an extra Ability Charge',
    SharpShooterSkill: 'deal critical damage (Sharpshooter)',
    ResurrectSkill: 'resurrect with health',
    CastAbilitySkill: 'trigger crew special ability',
    MedicalSkill: 'increase Medical/healing skill',
    ApplyArmorSkill: 'apply armor reinforcement to the room',
    FreezeAttackSkill: 'apply freeze effect to target room',
    DamageReductionSkillAll: 'reduce incoming crew damage',
    EMPModules: 'disable enemy room modules (EMP)',
    ReduceFutureDamageInstance: 'reduce incoming room damage',
    RoomDamageBoostInstance: 'boost damage dealt to the room',
    ReduceCrewStatusSkill: 'reduce duration of negative status effects on crew',
    GainItemSkill: 'spawn a temporary equipment item',
    FireSkill: 'set target room on fire (Fire Breath)',
    ReduceRoomStatusSkill: 'reduce negative status effect duration on rooms',
    CloakAttack: 'apply cloaking effect',
    MoveSpeedBoost: 'increase crew movement speed',
    Repair: 'increase Repair skill',
    BonusDamageSkill: 'boost bonus damage dealt',
    ShieldRepairSkill: 'restore ship shield',
    CriticalStunSkill: 'stun target enemy crew',
    CriticalPoisonSkill: 'apply poison to target enemy crew',
    FireWalkSkill: 'ignite room with fire walk'
  };

  const trigger = triggerMap[col.TriggerType] || col.TriggerType || 'On trigger';
  const effect = effectMap[col.enhancementType] || col.enhancementType || 'apply bonus';
  
  let valText = '';
  if (col.baseEnhancementValue > 0) {
    const isPct = col.enhancementType.toLowerCase().includes('speed') || col.enhancementType.toLowerCase().includes('percent');
    valText = ` by +${col.baseEnhancementValue}${isPct ? '%' : ''}`;
  }

  const chanceText = col.baseChance && col.baseChance < 100 ? `${col.baseChance}% chance to ` : '';
  
  return `${trigger}: ${chanceText}${effect}${valText}.`;
};

export function CollectionCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();

  const [crewList, setCrewList] = useState([]);
  const [collectionsList, setCollectionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIframeCrewId, setActiveIframeCrewId] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveIframeCrewId(null);
    };
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'OPEN_CREW_MODAL' && e.data.crewId) {
        setActiveIframeCrewId(e.data.crewId);
      }
    };
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/data/active/crew.json').then(res => res.json()),
      fetch('/data/active/collections.json').then(res => res.json())
    ])
      .then(([crewData, collectionsData]) => {
        setCrewList(crewData);
        setCollectionsList(collectionsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const collections = collectionsList.map(col => {
    const members = crewList.filter(c => String(c.collectionId) === String(col.id));
    return {
      ...col,
      members
    };
  }).filter(col => col.members.length > 0);

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.collectionCatalog.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.collectionCatalog.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {collections.map(col => (
          <div key={col.id} className="rounded-xl bg-slate-900/90 p-5 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800/20 pb-3">
              <div className="flex items-center space-x-3">
                <SpriteFrame spriteId={col.iconSpriteId} alt={col.name} size="sm" borderless className="shrink-0" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">{col.name}</h3>
                  <div className="text-[10px] text-slate-500 font-mono">Collection ID: #{col.id}</div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-950/80 px-2.5 py-1 rounded">{col.members.length} Members</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2 bg-indigo-950/40 p-3 rounded-lg">
                {col.abilityIconSpriteId && (
                  <SpriteFrame spriteId={col.abilityIconSpriteId} alt={col.abilityName} size="sm" borderless className="shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-indigo-300">Perk: {col.abilityName || 'Unnamed Perk'}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{col.description}</div>
                  <div className="text-[10px] text-emerald-400 font-medium mt-1">
                    <span className="font-extrabold">Effect — </span>
                    {getTechnicalPerkDescription(col)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perk Level Scaling</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                {Array.from({ length: col.maxCombo - col.minCombo + 1 }).map((_, idx) => {
                  const combo = col.minCombo + idx;
                  const chance = col.baseChance + (idx * col.stepChance);
                  const val = col.baseEnhancementValue + (idx * col.stepEnhancementValue);
                  
                  let bonusText = '';
                  if (col.enhancementType) {
                    const isPct = col.enhancementType.toLowerCase().includes('speed') || col.enhancementType.toLowerCase().includes('percent');
                    const cleanPerkType = col.enhancementType
                      .replace('Skill', '')
                      .replace('All', '')
                      .replace(/([A-Z])/g, ' $1')
                      .trim();
                    bonusText = `${val > 0 ? `+${val}${isPct ? '%' : ''}` : ''} ${cleanPerkType}`;
                  }
                  
                  const chanceText = chance < 100 ? `${chance}% chance` : '100% chance';
                  
                  return (
                    <div key={combo} className="flex justify-between items-center p-2 rounded bg-slate-950/60">
                      <span className="text-slate-400 font-bold">{combo} Crew:</span>
                      <span className="text-emerald-400 text-right">
                        {chanceText} {bonusText && `(${bonusText.trim()})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roster Members</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {col.members.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => setActiveIframeCrewId(m.id)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-950/80 text-xs cursor-pointer transition-all hover:scale-[1.01] group min-w-0"
                  >
                    <SpriteFrame spriteId={m.profileSpriteId} alt={m.name} size="sm" borderless className="bg-slate-900 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{m.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeIframeCrewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 backdrop-blur-sm sm:p-6">
          <div className="relative flex h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-2xl sm:h-[85vh]">
            <div className="flex items-center justify-between gap-2 bg-slate-950/60 px-3 py-3 sm:px-6 sm:py-4">
              <span className="min-w-0 truncate text-xs font-bold text-slate-400 font-mono tracking-wider">Crew Profile Preview</span>
              <button 
                onClick={() => setActiveIframeCrewId(null)}
                className="text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Close (ESC)
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-950 relative">
              <iframe
                src={publicUrl(
                  `/${lang}/library/crew/${activeIframeCrewId}?embed=true`
                )}
                title="Crew Profile Details"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
