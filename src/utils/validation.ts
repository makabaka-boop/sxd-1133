import { TripCard, TIME_SLOTS } from '../types';

export function calculateConflicts(cards: TripCard[]): number {
  let conflicts = 0;

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].isAnomaly) {
      conflicts++;
    }
  }

  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];

    const currentTimeIndex = TIME_SLOTS.indexOf(current.timeSlot);
    const nextTimeIndex = TIME_SLOTS.indexOf(next.timeSlot);

    if (currentTimeIndex > nextTimeIndex) {
      conflicts++;
    }

    if (current.line === next.line && currentTimeIndex === nextTimeIndex) {
      if (current.priority < next.priority) {
        conflicts++;
      }
    }
  }

  return conflicts;
}

export function checkAnomalies(cards: TripCard[]): string[] {
  const anomalies: string[] = [];

  cards.forEach((card, index) => {
    if (card.priority < 1 || card.priority > 5) {
      anomalies.push(`第${index + 1}张卡片「${card.station}」优先级异常：${card.priority}`);
    }

    if (!TIME_SLOTS.includes(card.timeSlot)) {
      anomalies.push(`第${index + 1}张卡片「${card.station}」时段无效`);
    }
  });

  return anomalies;
}

export function isCorrectOrder(cards: TripCard[]): boolean {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].correctOrder !== i) {
      return false;
    }
  }
  return true;
}
