export type Role = 'player' | 'hint' | 'reviewer';

export interface TripCard {
  id: string;
  line: string;
  station: string;
  timeSlot: string;
  priority: number;
  correctOrder: number;
  isLocked: boolean;
  isPending: boolean;
  isAnomaly: boolean;
  anomalyReason?: string;
}

export interface GameState {
  cards: TripCard[];
  currentRole: Role;
  startTime: number | null;
  elapsedTime: number;
  usedHints: number;
  isGameOver: boolean;
  score: number;
  conflictCount: number;
  showHintPanel: boolean;
  showResultModal: boolean;
  availableHints: string[];
  revealedHints: string[];
}

export interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  cardId: string | null;
}

export const TIME_SLOTS = [
  '早高峰 (07:00-09:00)',
  '上午 (09:00-12:00)',
  '中午 (12:00-14:00)',
  '下午 (14:00-17:00)',
  '晚高峰 (17:00-19:00)',
  '夜间 (19:00-22:00)',
];

export const LINES: Record<string, string[]> = {
  '1号线': ['起点站', '人民广场', '市中心', '商业街', '大学城', '终点站'],
  '2号线': ['火车站', '体育中心', '市政府', '科技园区', '国际机场'],
  '3号线': ['居民区', '购物中心', '医院', '公园', '工业区'],
};

export const ROLE_INFO: Record<Role, { name: string; icon: string; description: string }> = {
  player: { name: '玩家', icon: 'user', description: '拖拽排序行程卡' },
  hint: { name: '提示员', icon: 'lightbulb', description: '查看排序提示线索' },
  reviewer: { name: '复核员', icon: 'search', description: '检查异常行程卡' },
};
