import { ReviewStats } from '../types';

export function calculateScore(
  elapsedTime: number,
  conflictCount: number,
  usedHints: number,
  reviewStats?: ReviewStats
): number {
  const baseScore = 1000;
  const timePenalty = Math.floor(elapsedTime / 10) * 5;
  const conflictPenalty = conflictCount * 50;
  const hintPenalty = usedHints * 30;

  let unreviewedPenalty = 0;
  let falsePositivePenalty = 0;
  let confirmedBonus = 0;

  if (reviewStats) {
    unreviewedPenalty = reviewStats.unreviewed * 20;
    falsePositivePenalty = reviewStats.falsePositive * 10;
    confirmedBonus = reviewStats.confirmed * 15;
  }

  const finalScore = baseScore - timePenalty - conflictPenalty - hintPenalty - unreviewedPenalty - falsePositivePenalty + confirmedBonus;
  return Math.max(0, finalScore);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getScoreRating(score: number): { grade: string; color: string; message: string } {
  if (score >= 900) {
    return { grade: 'S', color: 'text-yellow-400', message: '完美！你是行程规划大师！' };
  } else if (score >= 800) {
    return { grade: 'A', color: 'text-green-400', message: '优秀！排序非常准确！' };
  } else if (score >= 600) {
    return { grade: 'B', color: 'text-blue-400', message: '良好！继续努力！' };
  } else if (score >= 400) {
    return { grade: 'C', color: 'text-orange-400', message: '及格，还需要更多练习！' };
  } else {
    return { grade: 'D', color: 'text-red-400', message: '加油，多注意排序规则！' };
  }
}
