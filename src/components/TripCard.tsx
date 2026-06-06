import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lock, HelpCircle, AlertTriangle, MapPin, Clock, Star } from 'lucide-react';
import { TripCard as TripCardType } from '../types';
import { useGameStore } from '../store/gameStore';

interface TripCardProps {
  card: TripCardType;
  onContextMenu: (e: React.MouseEvent, cardId: string) => void;
}

const lineColors: Record<string, string> = {
  '1号线': 'from-blue-500 to-blue-600',
  '2号线': 'from-green-500 to-green-600',
  '3号线': 'from-purple-500 to-purple-600',
};

export const TripCard: React.FC<TripCardProps> = ({ card, onContextMenu }) => {
  const { currentRole } = useGameStore();
  const canDrag = currentRole === 'player' && !card.isLocked;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBorderStyle = () => {
    if (card.isAnomaly && currentRole === 'reviewer') {
      return 'border-red-500 ring-2 ring-red-500/30';
    }
    if (card.isPending) {
      return 'border-yellow-500 ring-2 ring-yellow-500/30';
    }
    if (card.isLocked) {
      return 'border-slate-600 opacity-70';
    }
    return 'border-slate-600 hover:border-slate-500';
  };

  const getCursorClass = () => {
    if (card.isLocked) return 'cursor-not-allowed';
    if (canDrag) return 'cursor-grab';
    return 'cursor-default';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
      onContextMenu={(e) => onContextMenu(e, card.id)}
      className={`
        relative p-4 rounded-xl bg-slate-800/80 border-2
        transition-all duration-200 select-none
        ${getBorderStyle()}
        ${getCursorClass()}
        ${isDragging ? 'shadow-2xl scale-105 z-50 opacity-90 cursor-grabbing' : ''}
        ${canDrag ? 'hover:shadow-lg hover:-translate-y-0.5' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${lineColors[card.line] || 'from-slate-500 to-slate-600'}`}
            >
              {card.line}
            </span>
            <h3 className="font-semibold text-white text-lg">{card.station}</h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{card.timeSlot}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star
                size={14}
                className={card.priority > 5 ? 'text-red-400' : 'text-amber-400'}
                fill={card.priority > 5 ? 'text-red-400' : 'currentColor'}
              />
              <span className={card.priority > 5 ? 'text-red-400 font-medium' : ''}>
                优先级 {card.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {card.isLocked && (
            <Lock size={16} className="text-slate-400" />
          )}
          {card.isPending && (
            <HelpCircle size={16} className="text-yellow-400" />
          )}
          {card.isAnomaly && currentRole === 'reviewer' && (
            <AlertTriangle size={16} className="text-red-400" />
          )}
        </div>
      </div>

      {card.isAnomaly && currentRole === 'reviewer' && card.anomalyReason && (
        <div className="mt-2 pt-2 border-t border-red-500/30">
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertTriangle size={12} />
            {card.anomalyReason}
          </p>
        </div>
      )}
    </div>
  );
};
