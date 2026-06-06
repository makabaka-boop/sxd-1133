import React from 'react';
import { Trophy, Clock, AlertTriangle, Lightbulb, RotateCcw, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatTime, getScoreRating } from '../utils/scoring';

export const ResultModal: React.FC = () => {
  const { showResultModal, closeResultModal, restartGame, score, elapsedTime, conflictCount, usedHints } =
    useGameStore();

  if (!showResultModal) return null;

  const rating = getScoreRating(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeResultModal}
      />
      <div className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">游戏完成！</h2>
            <button
              onClick={closeResultModal}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="relative inline-block">
              <Trophy size={64} className={`${rating.color} mx-auto`} />
              <div
                className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold bg-slate-700 ${rating.color}`}
              >
                {rating.grade}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-5xl font-bold text-white mb-2">{score}</p>
              <p className={`text-lg font-medium ${rating.color}`}>{rating.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 rounded-xl bg-slate-700/50">
              <Clock size={20} className="mx-auto text-blue-400 mb-1" />
              <p className="text-xl font-bold text-white">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-slate-400">用时</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-700/50">
              <AlertTriangle size={20} className="mx-auto text-amber-400 mb-1" />
              <p className="text-xl font-bold text-white">{conflictCount}</p>
              <p className="text-xs text-slate-400">冲突数</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-700/50">
              <Lightbulb size={20} className="mx-auto text-yellow-400 mb-1" />
              <p className="text-xl font-bold text-white">{usedHints}</p>
              <p className="text-xs text-slate-400">使用提示</p>
            </div>
          </div>

          <div className="space-y-2 mb-6 p-4 rounded-xl bg-slate-700/30">
            <p className="text-sm text-slate-400 flex justify-between">
              <span>基础分</span>
              <span className="text-white">1000</span>
            </p>
            <p className="text-sm text-slate-400 flex justify-between">
              <span>时间惩罚</span>
              <span className="text-red-400">-{Math.floor(elapsedTime / 10) * 5}</span>
            </p>
            <p className="text-sm text-slate-400 flex justify-between">
              <span>冲突惩罚</span>
              <span className="text-red-400">-{conflictCount * 50}</span>
            </p>
            <p className="text-sm text-slate-400 flex justify-between">
              <span>提示惩罚</span>
              <span className="text-red-400">-{usedHints * 30}</span>
            </p>
            <div className="border-t border-slate-600 pt-2 mt-2">
              <p className="text-sm font-semibold flex justify-between">
                <span className="text-slate-300">最终得分</span>
                <span className="text-amber-400">{score}</span>
              </p>
            </div>
          </div>

          <button
            onClick={restartGame}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <RotateCcw size={18} />
            再来一局
          </button>
        </div>
      </div>
    </div>
  );
};
