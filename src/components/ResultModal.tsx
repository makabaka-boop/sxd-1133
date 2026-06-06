import React from 'react';
import { Trophy, Clock, AlertTriangle, Lightbulb, RotateCcw, X, CheckCircle, XCircle, Search } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatTime, getScoreRating } from '../utils/scoring';

export const ResultModal: React.FC = () => {
  const { showResultModal, closeResultModal, restartGame, score, elapsedTime, conflictCount, usedHints, reviewStats } =
    useGameStore();

  if (!showResultModal) return null;

  const rating = getScoreRating(score);

  const unreviewedPenalty = reviewStats.unreviewed * 20;
  const falsePositivePenalty = reviewStats.falsePositive * 10;
  const confirmedBonus = reviewStats.confirmed * 15;

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

          <div className="grid grid-cols-3 gap-3 mb-4">
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

          <div className="mb-6 p-4 rounded-xl bg-slate-700/30 border border-slate-600">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Search size={16} className="text-blue-400" />
              复核统计
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-slate-800/50">
                <p className="text-lg font-bold text-slate-300">{reviewStats.totalAnomalies}</p>
                <p className="text-xs text-slate-500">异常卡总数</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-500/10">
                <p className="text-lg font-bold text-red-400">{reviewStats.confirmed}</p>
                <p className="text-xs text-slate-500">已确认异常</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-500/10">
                <p className="text-lg font-bold text-amber-400">{reviewStats.falsePositive}</p>
                <p className="text-xs text-slate-500">误报</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-700/50">
                <p className="text-lg font-bold text-slate-400">{reviewStats.unreviewed}</p>
                <p className="text-xs text-slate-500">未复核</p>
              </div>
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
            {reviewStats.confirmed > 0 && (
              <p className="text-sm text-slate-400 flex justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-400" />
                  确认异常奖励
                </span>
                <span className="text-green-400">+{confirmedBonus}</span>
              </p>
            )}
            {reviewStats.unreviewed > 0 && (
              <p className="text-sm text-slate-400 flex justify-between">
                <span className="flex items-center gap-1">
                  <AlertTriangle size={12} className="text-red-400" />
                  未复核惩罚
                </span>
                <span className="text-red-400">-{unreviewedPenalty}</span>
              </p>
            )}
            {reviewStats.falsePositive > 0 && (
              <p className="text-sm text-slate-400 flex justify-between">
                <span className="flex items-center gap-1">
                  <XCircle size={12} className="text-amber-400" />
                  误报惩罚
                </span>
                <span className="text-red-400">-{falsePositivePenalty}</span>
              </p>
            )}
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
