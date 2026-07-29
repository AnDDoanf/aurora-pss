import { describe, expect, it } from 'vitest';
import {
  calculateDistribution,
  calculateTrainedStat,
  calculateTrainingPossibilities,
  getTrainingCapacity,
  isPrimaryTrainingStat,
  recommendPrograms,
  summarizeTraining
} from '../src/features/training/trainingCalculations';

const program = {
  id: 1,
  name: 'Balanced',
  hp: 2,
  atk: 2,
  rpr: 0,
  abl: 0,
  sta: 0,
  plt: 0,
  sci: 0,
  eng: 0,
  wpn: 0,
  fatigue: 6,
  duration: 3600,
  variableChance: 0.25,
  minGuarantee: 2
};

describe('crew training calculations', () => {
  it('prefers the API capacity and falls back to rarity', () => {
    expect(getTrainingCapacity({ rarity: 'Legendary', raw: { TrainingCapacity: 115 } })).toBe(115);
    expect(getTrainingCapacity({ rarity: 'Legendary' })).toBe(110);
  });

  it('summarizes spent, remaining, and overflow points', () => {
    expect(summarizeTraining({ hp: 40, atk: 20 }, 50)).toEqual({
      spent: 60,
      remaining: 0,
      overCapacity: 10
    });
  });

  it('applies training percentages and uses the stat rounding rules', () => {
    expect(calculateTrainedStat(10, 5, 'hp')).toBe(11);
    expect(calculateTrainedStat(10, 4, 'hp')).toBe(10);
    expect(calculateTrainedStat(7.2, 15, 'atk')).toBe(8.3);
  });

  it('distributes points using chance weights and variability', () => {
    const hp = calculateDistribution(program, 100, 'hp', 'regular').find((item) => item.key === 'hp');
    expect(hp.share).toBe(0.5);
    expect(hp.expected).toBe(50);
    expect(hp.min).toBe(37.5);
    expect(hp.max).toBe(62.5);
  });

  it('biases Elite outcomes toward the selected stat', () => {
    const regular = calculateDistribution(program, 100, 'hp', 'regular').find((item) => item.key === 'hp');
    const elite = calculateDistribution(program, 100, 'hp', 'elite').find((item) => item.key === 'hp');
    expect(elite.share).toBeGreaterThan(regular.share);
  });

  it('ranks fatigue-compatible target programs first', () => {
    const blocked = { ...program, id: 2, name: 'Blocked', hp: 10, atk: 0, fatigue: 24 };
    const available = { ...program, id: 3, name: 'Available', hp: 3, atk: 1, fatigue: 1 };
    expect(recommendPrograms([blocked, available], 'hp', 'regular', 90)[0].id).toBe(3);
  });

  it('does not recommend rank-100 instant consumables over repeatable training', () => {
    const instant = { ...program, id: 4, rank: 100, hp: 20, atk: 0, fatigue: 0 };
    const repeatable = { ...program, id: 5, rank: 1, hp: 3, atk: 1, fatigue: 1 };
    expect(recommendPrograms([instant, repeatable], 'hp')[0].id).toBe(5);
  });

  it('accepts only programs where the target has the highest chance weight', () => {
    expect(isPrimaryTrainingStat({ ...program, hp: 2, atk: 2 }, 'hp')).toBe(true);
    expect(isPrimaryTrainingStat({ ...program, hp: 1, atk: 3 }, 'hp')).toBe(false);
  });

  it('recalculates possibilities from fatigue and current training points', () => {
    const focused = { ...program, hp: 3, atk: 0, minGuarantee: 1 };
    const fresh = calculateTrainingPossibilities(focused, 100, { hp: 0 }, 0, 'hp');
    const tired = calculateTrainingPossibilities(focused, 100, { hp: 0 }, 75, 'hp');
    const trained = calculateTrainingPossibilities(focused, 100, { hp: 50 }, 0, 'hp');
    expect(fresh.find((row) => row.key === 'hp').max).toBeGreaterThan(tired.find((row) => row.key === 'hp').max);
    expect(fresh.find((row) => row.key === 'hp').max).toBeGreaterThan(trained.find((row) => row.key === 'hp').max);
    expect(fresh.find((row) => row.key === 'hp').min).toBe(1);
  });
});
