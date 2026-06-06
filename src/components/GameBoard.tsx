import React, { useState, useEffect } from 'react';
import { Send, Lightbulb, RotateCcw, Info } from 'lucide-react';
import { CardList } from './CardList';
import { ContextMenu } from './ContextMenu';
import { StatusBar } from './StatusBar';
import { RolePanel } from './RolePanel';
import { HintPanel } from './HintPanel';
import { ResultModal } from './ResultModal';
import { useGameStore } from '../store/gameStore';
import { useTimer } from '../hooks/useTimer';
import { ContextMenuState } from '../types';

export const GameBoard: React.FC = () => {
  const { submitResult, toggleHintPanel, startTime, setStartTime, isGameOver } = useGameStore();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    cardId: null,
  });

  useTimer();

  useEffect(() => {
    if (!startTime) {
      setStartTime();
    }
  }, [startTime, setStartTime]);

  const handleContextMenu = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      cardId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, show: false, cardId: null }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            行程卡排序挑战
          </h1>
          <p className="text-slate-400">
            将打乱的行程卡按正确顺序排列，右键卡片获取更多操作
          </p>
        </header>

        <div className="space-y-4">
          <StatusBar />

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <Info size={18} className="text-blue-400" />
                    行程卡列表
                  </h2>
                  <span className="text-sm text-slate-400">
                    拖拽排序 · 右键操作
                  </span>
                </div>
                <CardList onContextMenu={handleContextMenu} />
              </div>
            </div>

            <div className="space-y-4">
              <RolePanel />

              <div className="space-y-2">
                <button
                  onClick={toggleHintPanel}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Lightbulb size={18} />
                  查看提示
                </button>

                <button
                  onClick={submitResult}
                  disabled={isGameOver}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <Send size={18} />
                  提交结果
                </button>

                <button
                  onClick={() => useGameStore.getState().restartGame()}
                  className="w-full py-3 px-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  重新开始
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-2">排序规则</h3>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• 按时段先后顺序排列</li>
                  <li>• 同线路按时段+优先级排序</li>
                  <li>• 检查并排除异常卡片</li>
                  <li>• 数字越大优先级越高</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {contextMenu.show && contextMenu.cardId && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          cardId={contextMenu.cardId}
          onClose={closeContextMenu}
        />
      )}

      <HintPanel />
      <ResultModal />
    </div>
  );
};
