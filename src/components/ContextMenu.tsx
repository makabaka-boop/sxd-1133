import React, { useEffect } from 'react';
import { Lock, Unlock, HelpCircle, ArrowDown, CheckCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface ContextMenuProps {
  x: number;
  y: number;
  cardId: string;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, cardId, onClose }) => {
  const { cards, toggleLockCard, togglePendingCard, moveCardToEnd, revealHint, currentRole } =
    useGameStore();
  const card = cards.find((c) => c.id === cardId);

  useEffect(() => {
    const handleClick = () => onClose();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!card) return null;

  const menuItems = [
    {
      id: 'toggle-lock',
      icon: card.isLocked ? Unlock : Lock,
      label: card.isLocked ? '解锁位置' : '锁定位置',
      onClick: () => {
        toggleLockCard(cardId);
        onClose();
      },
      show: true,
    },
    {
      id: 'toggle-pending',
      icon: CheckCircle,
      label: card.isPending ? '取消待核对' : '标记待核对',
      onClick: () => {
        togglePendingCard(cardId);
        onClose();
      },
      show: true,
    },
    {
      id: 'show-hint',
      icon: HelpCircle,
      label: '查看提示',
      onClick: () => {
        revealHint();
        onClose();
      },
      show: currentRole === 'hint',
    },
    {
      id: 'move-to-end',
      icon: ArrowDown,
      label: '移到末尾',
      onClick: () => {
        moveCardToEnd(cardId);
        onClose();
      },
      show: !card.isLocked,
    },
  ].filter((item) => item.show);

  return (
    <div
      className="fixed z-50 min-w-[180px] rounded-lg bg-slate-800 shadow-2xl border border-slate-700 py-2 animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: Math.min(x, window.innerWidth - 200),
        top: Math.min(y, window.innerHeight - menuItems.length * 40 - 20),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          onClick={item.onClick}
        >
          <item.icon size={16} className="text-slate-400" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
