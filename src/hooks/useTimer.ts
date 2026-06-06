import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useTimer() {
  const { startTime, elapsedTime, isGameOver, updateElapsedTime } = useGameStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (startTime && !isGameOver) {
      intervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        updateElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime, isGameOver, updateElapsedTime]);

  return { elapsedTime };
}
