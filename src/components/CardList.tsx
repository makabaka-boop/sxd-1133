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
  const { cards, setCards } = useGameStore();
  const [activeId, setActiveId] = useState<string | null>(null);

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
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const activeCard = cards.find((c) => c.id === active.id);
      if (activeCard?.isLocked) return;

      const oldIndex = cards.findIndex((c) => c.id === active.id);
      const newIndex = cards.findIndex((c) => c.id === over.id);
      const newCards = arrayMove(cards, oldIndex, newIndex);
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
