import { create } from 'zustand';
import { GameState, Role, TripCard, ReviewStatus, ReviewStats } from '../types';
import { generateCards, generateHints } from '../utils/cardGenerator';
import { calculateConflicts, isCorrectOrder } from '../utils/validation';
import { calculateScore } from '../utils/scoring';

function calculateReviewStats(cards: TripCard[]): ReviewStats {
  const anomalyCards = cards.filter((c) => c.isAnomaly);
  return {
    totalAnomalies: anomalyCards.length,
    confirmed: anomalyCards.filter((c) => c.reviewStatus === 'confirmed').length,
    falsePositive: anomalyCards.filter((c) => c.reviewStatus === 'false_positive').length,
    unreviewed: anomalyCards.filter((c) => c.reviewStatus === 'unreviewed').length,
    pendingCards: cards.filter((c) => c.isPending).length,
  };
}

interface GameActions {
  initGame: () => void;
  setCards: (cards: TripCard[]) => void;
  setCurrentRole: (role: Role) => void;
  updateElapsedTime: (time: number) => void;
  toggleLockCard: (cardId: string) => void;
  togglePendingCard: (cardId: string) => void;
  setReviewStatus: (cardId: string, status: ReviewStatus) => void;
  moveCardToEnd: (cardId: string) => void;
  revealHint: () => void;
  toggleHintPanel: () => void;
  toggleSubmitWarning: (show: boolean) => void;
  submitResult: () => void;
  closeResultModal: () => void;
  restartGame: () => void;
  setStartTime: () => void;
  updateReviewStats: () => void;
}

const initialCards = generateCards();
const initialHints = generateHints(initialCards);

const getInitialState = (): GameState => {
  const cards = generateCards();
  const hints = generateHints(cards);
  return {
    cards,
    currentRole: 'player',
    startTime: null,
    elapsedTime: 0,
    usedHints: 0,
    isGameOver: false,
    score: 0,
    conflictCount: 0,
    showHintPanel: false,
    showResultModal: false,
    availableHints: hints,
    revealedHints: [],
    showSubmitWarning: false,
    reviewStats: calculateReviewStats(cards),
  };
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...getInitialState(),

  initGame: () => {
    set(getInitialState());
  },

  setCards: (cards: TripCard[]) => {
    set({ cards });
  },

  setCurrentRole: (role: Role) => {
    set({ currentRole: role });
  },

  updateElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },

  toggleLockCard: (cardId: string) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, isLocked: !card.isLocked } : card
      ),
    }));
  },

  togglePendingCard: (cardId: string) => {
    set((state) => {
      const newCards = state.cards.map((card) =>
        card.id === cardId ? { ...card, isPending: !card.isPending } : card
      );
      return {
        cards: newCards,
        reviewStats: calculateReviewStats(newCards),
      };
    });
  },

  setReviewStatus: (cardId: string, status: ReviewStatus) => {
    set((state) => {
      const newCards = state.cards.map((card) =>
        card.id === cardId ? { ...card, reviewStatus: status } : card
      );
      return {
        cards: newCards,
        reviewStats: calculateReviewStats(newCards),
      };
    });
  },

  updateReviewStats: () => {
    set((state) => ({
      reviewStats: calculateReviewStats(state.cards),
    }));
  },

  toggleSubmitWarning: (show: boolean) => {
    set({ showSubmitWarning: show });
  },

  moveCardToEnd: (cardId: string) => {
    set((state) => {
      const cardIndex = state.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return state;
      const newCards = [...state.cards];
      const [card] = newCards.splice(cardIndex, 1);
      newCards.push(card);
      return { cards: newCards };
    });
  },

  revealHint: () => {
    const state = get();
    if (state.revealedHints.length >= state.availableHints.length) return;
    
    const nextHint = state.availableHints[state.revealedHints.length];
    set((state) => ({
      revealedHints: [...state.revealedHints, nextHint],
      usedHints: state.usedHints + 1,
    }));
  },

  toggleHintPanel: () => {
    set((state) => ({ showHintPanel: !state.showHintPanel }));
  },

  submitResult: () => {
    const state = get();
    const stats = calculateReviewStats(state.cards);
    const hasUnreviewedAnomalies = stats.unreviewed > 0;
    const hasPendingCards = stats.pendingCards > 0;

    if ((hasUnreviewedAnomalies || hasPendingCards) && !state.showSubmitWarning) {
      set({ showSubmitWarning: true });
      return;
    }

    const conflicts = calculateConflicts(state.cards);
    const score = calculateScore(state.elapsedTime, conflicts, state.usedHints, stats);
    
    set({
      conflictCount: conflicts,
      score,
      isGameOver: true,
      showResultModal: true,
      showSubmitWarning: false,
      reviewStats: stats,
    });
  },

  closeResultModal: () => {
    set({ showResultModal: false });
  },

  restartGame: () => {
    const cards = generateCards();
    const hints = generateHints(cards);
    set({
      cards,
      currentRole: 'player',
      startTime: Date.now(),
      elapsedTime: 0,
      usedHints: 0,
      isGameOver: false,
      score: 0,
      conflictCount: 0,
      showHintPanel: false,
      showResultModal: false,
      availableHints: hints,
      revealedHints: [],
      showSubmitWarning: false,
      reviewStats: calculateReviewStats(cards),
    });
  },

  setStartTime: () => {
    set({ startTime: Date.now() });
  },
}));
