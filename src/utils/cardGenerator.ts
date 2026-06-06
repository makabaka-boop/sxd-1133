import { TripCard, TIME_SLOTS, LINES } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function generateCards(): TripCard[] {
  const cards: TripCard[] = [];
  const lineNames = Object.keys(LINES);
  let correctOrder = 0;

  const selectedLines = shuffleArray(lineNames).slice(0, 2);
  
  selectedLines.forEach((line) => {
    const stations = LINES[line];
    const numStations = Math.min(3 + Math.floor(Math.random() * 2), stations.length);
    const selectedStations = stations.slice(0, numStations);
    
    const timeSlotIndices = shuffleArray(
      Array.from({ length: TIME_SLOTS.length }, (_, i) => i)
    ).slice(0, selectedStations.length);
    
    timeSlotIndices.sort((a, b) => a - b);

    selectedStations.forEach((station, idx) => {
      cards.push({
        id: generateId(),
        line,
        station,
        timeSlot: TIME_SLOTS[timeSlotIndices[idx]],
        priority: Math.floor(Math.random() * 5) + 1,
        correctOrder: correctOrder++,
        isLocked: false,
        isPending: false,
        isAnomaly: false,
        reviewStatus: 'unreviewed',
      });
    });
  });

  const anomalyIndex = Math.floor(Math.random() * cards.length);
  const anomalyCard = { ...cards[anomalyIndex] };
  anomalyCard.isAnomaly = true;
  anomalyCard.priority = 6;
  anomalyCard.anomalyReason = '优先级异常（超出正常范围1-5）';
  anomalyCard.reviewStatus = 'unreviewed';

  cards[anomalyIndex] = anomalyCard;

  return shuffleArray(cards);
}

export function generateHints(cards: TripCard[]): string[] {
  const hints: string[] = [];
  const sortedCards = [...cards].sort((a, b) => a.correctOrder - b.correctOrder);
  
  const firstCard = sortedCards[0];
  hints.push(`第一张卡片应该是 ${firstCard.line} 的 ${firstCard.station} 站`);

  const lines = [...new Set(cards.map((c) => c.line))];
  hints.push(`本次行程涉及 ${lines.length} 条线路：${lines.join('、')}`);

  const anomalyCard = cards.find((c) => c.isAnomaly);
  if (anomalyCard) {
    hints.push(`注意检查每张卡片的优先级，正常范围应为1-5`);
  }

  hints.push('按时段先后顺序排列：早高峰 → 上午 → 中午 → 下午 → 晚高峰 → 夜间');

  return hints;
}

export function getCardPositionHint(card: TripCard, allCards: TripCard[]): string {
  const sortedCards = [...allCards].sort((a, b) => a.correctOrder - b.correctOrder);
  const position = sortedCards.findIndex((c) => c.id === card.id) + 1;
  const total = sortedCards.length;
  
  if (position === 1) {
    return `这张卡片应该在第1位，是${card.timeSlot}时段的起始站`;
  } else if (position === total) {
    return `这张卡片应该在最后，是${card.timeSlot}时段的终点站`;
  } else {
    const prevCard = sortedCards[position - 2];
    const nextCard = sortedCards[position];
    return `这张卡片应该在第${position}位，位于 ${prevCard.station} 和 ${nextCard.station} 之间`;
  }
}
