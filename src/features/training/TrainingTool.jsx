import React, { useEffect, useMemo, useState } from 'react';
import fallbackTrainingPrograms from '../../../training_designs_parsed.json';
import { SEOHead } from '../../components/SEOHead';
import { useTranslation } from '../../i18n/useTranslation';
import { publicUrl } from '../../utils/publicUrl';
import {
  EMPTY_TRAINING, TRAINING_STATS, clampTrainingAllocation, clampTrainingValue,
  calculateTrainingPossibilities, getTrainingCapacity, recommendPrograms, summarizeTraining
} from './trainingCalculations';
import { CrewStage, ProgramSelector, TrainingStats } from './_components/TrainingPanels';

export function TrainingTool() {
  const { t, lang } = useTranslation();
  const [crew, setCrew] = useState([]);
  const [instantItems, setInstantItems] = useState([]);
  const [apiPrograms, setApiPrograms] = useState(fallbackTrainingPrograms);
  const [programSource, setProgramSource] = useState('fallback');
  const [crewId, setCrewId] = useState('');
  const [target, setTarget] = useState('abl');
  const [training, setTraining] = useState({ ...EMPTY_TRAINING });
  const [crisprCount, setCrisprCount] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJson = (path) => fetch(publicUrl(path)).then((response) => {
      if (!response.ok) throw new Error(`${path} request failed (${response.status})`);
      return response.json();
    });

    Promise.all([
      fetchJson('/data/active/crew.json'),
      fetchJson('/data/active/items.json'),
      fetchJson('/data/active/training.json').catch((error) => {
        console.warn('Using bundled training-design fallback:', error);
        return null;
      })
    ])
      .then(([crewData, itemData, trainingData]) => {
        const sorted = [...crewData].sort((a, b) => a.name.localeCompare(b.name));
        setCrew(sorted);
        setInstantItems(itemData.filter((item) => item.itemSubType === 'InstantTraining' && item.raw?.TrainingDesignId));
        if (Array.isArray(trainingData) && trainingData.length > 0) {
          setApiPrograms(trainingData);
          setProgramSource('snapshot');
        }
        setCrewId(String((sorted.find((item) => item.name === 'Silver Paladin') || sorted[0])?.id ?? ''));
      })
      .catch((error) => console.error('Failed to load crew for training tool:', error))
      .finally(() => setLoading(false));
  }, []);

  const selectedCrew = crew.find((item) => String(item.id) === String(crewId));
  const programs = useMemo(() => {
    const itemsByTrainingId = new Map();
    instantItems.forEach((item) => {
      const trainingId = Number(item.raw.TrainingDesignId);
      // Some event items reuse a training design. The first entry is the
      // canonical consumable (for example, Super Protein Shake for HP tier 4).
      if (!itemsByTrainingId.has(trainingId)) itemsByTrainingId.set(trainingId, item);
    });
    return apiPrograms.map((program) => {
      const item = itemsByTrainingId.get(Number(program.id));
      return item ? {
        ...program,
        name: item.name,
        spriteId: item.imageSpriteId || item.logoSpriteId || program.spriteId,
        itemId: item.id,
        itemRarity: item.rarity
      } : program;
    });
  }, [apiPrograms, instantItems]);
  const capacity = getTrainingCapacity(selectedCrew, crisprCount);
  const summary = summarizeTraining(training, capacity);
  const recommendations = useMemo(() => recommendPrograms(programs, target, 'regular', fatigue), [fatigue, programs, target]);
  const recommended = recommendations[0];
  const selectedBase = programs.find((item) => item.id === selectedProgramId);
  const selected = selectedBase
    ? recommendPrograms([selectedBase], target, 'regular', fatigue)[0] || {
      ...selectedBase,
      targetShare: 0,
      available: Number(fatigue) + (Number(selectedBase.fatigue) || 0) <= 100
    }
    : recommended;
  const distribution = calculateTrainingPossibilities(selected, capacity, training, fatigue, target, 'regular');
  const maxTargetPoints = distribution.find((row) => row.key === target)?.max || 0;

  const handleSimulate = () => {
    if (!selected || fatigue >= 100 || summary.remaining <= 0 || selected.available === false) return;

    const addedFatigue = Number(selected.fatigue) || 0;
    const newFatigue = Math.min(fatigue + addedFatigue, 100);

    const newTraining = { ...training };
    let remainingCapacity = summary.remaining;
    distribution.forEach((row) => {
      if (remainingCapacity <= 0) return;
      const minVal = Math.max(0, Math.floor(row.min ?? 0));
      const maxVal = Math.min(
        remainingCapacity,
        Math.max(minVal, Math.floor(row.max ?? row.expected ?? 0))
      );

      let gain = 0;
      if (maxVal > minVal) {
        // Roll random integer gain in range [minVal, maxVal] inclusive
        gain = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      } else {
        gain = maxVal;
      }

      if (gain > 0) {
        newTraining[row.key] = clampTrainingValue((newTraining[row.key] || 0) + gain, capacity);
        remainingCapacity -= gain;
      }
    });

    setTraining(newTraining);
    setFatigue(newFatigue);
  };

  const reset = () => {
    setTraining({ ...EMPTY_TRAINING });
    setCrisprCount(0);
    setFatigue(0);
    setTarget('abl');
    setSelectedProgramId(null);
  };

  const updateCrisprCount = (nextCount) => {
    const normalizedCount = Math.min(Math.max(Math.trunc(Number(nextCount) || 0), 0), 2);
    const nextCapacity = getTrainingCapacity(selectedCrew, normalizedCount);
    setCrisprCount(normalizedCount);
    setTraining((current) => clampTrainingAllocation(current, nextCapacity));
  };

  const updateTrainingStat = (key, nextValue) => {
    setTraining((current) => {
      const otherSpent = TRAINING_STATS.reduce((sum, stat) => (
        stat.key === key ? sum : sum + (Number(current[stat.key]) || 0)
      ), 0);
      return {
        ...current,
        [key]: clampTrainingValue(nextValue, Math.max(capacity - otherSpent, 0))
      };
    });
  };

  const stepTrainingStat = (key, delta) => {
    setTraining((current) => {
      const otherSpent = TRAINING_STATS.reduce((sum, stat) => (
        stat.key === key ? sum : sum + (Number(current[stat.key]) || 0)
      ), 0);
      return {
        ...current,
        [key]: clampTrainingValue(
          (Number(current[key]) || 0) + delta,
          Math.max(capacity - otherSpent, 0)
        )
      };
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-3 pb-8 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:pb-0">
      <SEOHead title={t('training.seoTitle')} description={t('training.seoDescription')} />

      <header className="page-header shrink-0">
        <div>
          <h1 className="page-title ">{t('training.pageTitle')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('training.pageDescription')}</p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
            programSource === 'snapshot'
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-amber-500/10 text-amber-300'
          }`}
          title={programSource === 'snapshot' ? t('training.snapshotSourceHint') : t('training.fallbackSourceHint')}
        >
          {programSource === 'snapshot' ? t('training.snapshotSource') : t('training.fallbackSource')} Â· {programs.length}
        </div>
      </header>

      <div className="grid gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <CrewStage
          crew={crew}
          crewId={crewId}
          selectedCrew={selectedCrew}
          capacity={capacity}
          crisprCount={crisprCount}
          summary={summary}
          fatigue={fatigue}
          loading={loading}
          onCrewChange={(value) => {
            setCrewId(value);
            setTraining({ ...EMPTY_TRAINING });
            setCrisprCount(0);
          }}
          onCrisprChange={updateCrisprCount}
          onFatigueChange={setFatigue}
          t={t}
        />

        <main className="min-h-0">
          <div className="xl:h-full">
            <TrainingStats
              selectedCrew={selectedCrew}
              training={training}
              capacity={capacity}
              summary={summary}
              distribution={distribution}
              fatigue={fatigue}
              selectedProgram={selected}
              onSimulate={handleSimulate}
              onReset={reset}
              lang={lang}
              onChange={updateTrainingStat}
              onStep={stepTrainingStat}
              t={t}
            >
              <ProgramSelector
                embedded
                programs={programs}
                selectedId={selectedProgramId}
                selected={selected}
                target={target}
                maxTargetPoints={maxTargetPoints}
                onSelect={setSelectedProgramId}
                onTargetChange={(value) => {
                  setTarget(value);
                  setSelectedProgramId(null);
                }}
                t={t}
              />
            </TrainingStats>
          </div>
        </main>
      </div>


    </div>
  );
}

export default TrainingTool;
