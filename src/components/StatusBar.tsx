import React from 'react';
import { Clock, AlertTriangle, Trophy, Lightbulb } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatTime } from '../utils/scoring';

export const StatusBar: React.FC = () => {
  const { elapsedTime, conflictCount, score, usedHints, isGameOver } = useGameStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-blue-400" />
          <span className="text-slate-300 font-mono text-lg">{formatTime(elapsedTime)}</span>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400" />
          <span className="text-slate-300">
            冲突: <span className="font-semibold text-amber-400">{conflictCount}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-yellow-400" />
          <span className="text-slate-300">
            提示: <span className="font-semibold text-yellow-400">{usedHints}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-amber-400" />
        <span className="text-slate-300">
          得分: <span className="font-bold text-2xl text-amber-400">{isGameOver ? score : '---'}</span>
        </span>
      </div>
    </div>
  );
};
