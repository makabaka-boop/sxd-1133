import React, { useEffect } from 'react';
import { Lock, Unlock, HelpCircle, ArrowDown, CheckCircle, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ReviewStatus } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  cardId: string;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, cardId, onClose }) => {
  const { cards, toggleLockCard, togglePendingCard, moveCardToEnd, revealHint, currentRole, setReviewStatus } =
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

  const handleSetReviewStatus = (status: ReviewStatus) => {
    setReviewStatus(cardId, status);
    onClose();
  };

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
      id: 'divider-1',
      isDivider: true,
      show: currentRole === 'reviewer' && card.isAnomaly,
    },
    {
      id: 'confirm-anomaly',
      icon: AlertTriangle,
      label: '已确认异常',
      onClick: () => handleSetReviewStatus('confirmed'),
      show: currentRole === 'reviewer' && card.isAnomaly && card.reviewStatus !== 'confirmed',
      className: 'text-red-400 hover:bg-red-500/20',
    },
    {
      id: 'mark-false-positive',
      icon: XCircle,
      label: '标记为误报',
      onClick: () => handleSetReviewStatus('false_positive'),
      show: currentRole === 'reviewer' && card.isAnomaly && card.reviewStatus !== 'false_positive',
      className: 'text-amber-400 hover:bg-amber-500/20',
    },
    {
      id: 'reset-review',
      icon: RotateCcw,
      label: '重置复核状态',
      onClick: () => handleSetReviewStatus('unreviewed'),
      show: currentRole === 'reviewer' && card.isAnomaly && card.reviewStatus !== 'unreviewed',
      className: 'text-slate-400 hover:bg-slate-700',
    },
    {
      id: 'divider-2',
      isDivider: true,
      show: currentRole === 'hint',
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
      id: 'divider-3',
      isDivider: true,
      show: !card.isLocked,
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
      {menuItems.map((item) => {
        if ('isDivider' in item && item.isDivider) {
          return <div key={item.id} className="my-1 border-t border-slate-700" />;
        }
        return (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${item.className || 'text-slate-200 hover:bg-slate-700'}`}
            onClick={item.onClick}
          >
            <item.icon size={16} className="text-slate-400" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
