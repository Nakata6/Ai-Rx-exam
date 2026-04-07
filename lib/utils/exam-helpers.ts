import type { Score } from '@/types/exam';

export const computeScore = (s: Score) => {
  const total  = s.c + s.w + s.p;
  const points = s.c + s.p * 0.5;
  return {
    points,
    total,
    accuracy: Math.round((points / Math.max(1, total)) * 100),
  };
};
