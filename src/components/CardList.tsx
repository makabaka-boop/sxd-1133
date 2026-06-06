import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TripCard } from './TripCard';
import { useGameStore } from '../store/gameStore';
import { TripCard as TripCardType } from '../types';
import { useState } from 'react';

interface CardListProps {
  onContextMenu: (e: React.MouseEvent, cardId: string) => void;
}

export const CardList: React.FC<CardListProps> = ({ onContextMenu }) => {
  const { cards, setCards, currentRole } = useGameStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const canDrag = currentRole === 'player';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (!canDrag) return;
    const activeCard = cards.find((c) => c.id === event.active.id);
    if (activeCard?.isLocked) return;
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!canDrag || !over || active.id === over.id) return;

    const activeCard = cards.find((c) => c.id === active.id);
    if (activeCard?.isLocked) return;

    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const overIndex = cards.findIndex((c) => c.id === over.id);
    const overCard = cards[overIndex];

    if (overCard?.isLocked) {
      let targetIndex = overIndex;
      if (oldIndex < overIndex) {
        while (targetIndex < cards.length && cards[targetIndex]?.isLocked) {
          targetIndex++;
        }
        if (targetIndex >= cards.length) {
          targetIndex = overIndex;
          while (targetIndex > 0 && cards[targetIndex]?.isLocked) {
            targetIndex--;
          }
        }
      } else {
        while (targetIndex >= 0 && cards[targetIndex]?.isLocked) {
          targetIndex--;
        }
        if (targetIndex < 0) {
          targetIndex = overIndex;
          while (targetIndex < cards.length && cards[targetIndex]?.isLocked) {
            targetIndex++;
          }
        }
      }
      
      if (targetIndex !== oldIndex && targetIndex >= 0 && targetIndex < cards.length) {
        let newCards = arrayMove(cards, oldIndex, targetIndex);
        const lockedCards = newCards.map((c, i) => ({ card: c, originalIndex: i }))
          .filter(({ card }) => card.isLocked);
        
        lockedCards.forEach(({ card, originalIndex }) => {
          const currentIndex = newCards.findIndex((c) => c.id === card.id);
          if (currentIndex !== originalIndex) {
            newCards = arrayMove(newCards, currentIndex, originalIndex);
          }
        });
        
        setCards(newCards);
      }
    } else {
      let newCards = arrayMove(cards, oldIndex, overIndex);
      const lockedPositions = cards
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card.isLocked);
      
      lockedPositions.forEach(({ card, index }) => {
        const currentIndex = newCards.findIndex((c) => c.id === card.id);
        if (currentIndex !== index) {
          newCards = arrayMove(newCards, currentIndex, index);
        }
      });
      
      setCards(newCards);
    }
  };

  const activeCard = activeId ? cards.find((c) => c.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {cards.map((card) => (
            <TripCard key={card.id} card={card} onContextMenu={onContextMenu} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeCard ? (
          <div className="opacity-90 rotate-2 scale-105 shadow-2xl">
            <TripCard card={activeCard} onContextMenu={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
