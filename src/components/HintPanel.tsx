import React from 'react';
import { X, Lightbulb, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const HintPanel: React.FC = () => {
  const { showHintPanel, toggleHintPanel, revealedHints, availableHints, revealHint } =
    useGameStore();

  if (!showHintPanel) return null;

  const remainingHints = availableHints.length - revealedHints.length;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={toggleHintPanel}
      />
      <div className="relative w-80 h-full bg-slate-900 border-l border-slate-700 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-amber-400" size={20} />
            <h2 className="font-semibold text-white">提示线索</h2>
          </div>
          <button
            onClick={toggleHintPanel}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-140px)]">
          {revealedHints.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-500 text-sm">还没有查看任何提示</p>
              <p className="text-slate-600 text-xs mt-1">点击下方按钮获取线索</p>
            </div>
          ) : (
            <div className="space-y-3">
              {revealedHints.map((hint, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
                >
                  <div className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-100">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
          <button
            onClick={revealHint}
            disabled={remainingHints === 0}
            className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Lightbulb size={18} />
            {remainingHints > 0 ? `获取提示 (剩余 ${remainingHints})` : '没有更多提示'}
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">每使用一个提示扣 30 分</p>
        </div>
      </div>
    </div>
  );
};
