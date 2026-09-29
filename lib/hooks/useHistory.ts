'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { HistoryItem } from '@/types';
import { getStoredHistory, saveStoredHistory } from '@/lib/storage';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const isHydratedRef = useRef(false);

  // Hydrate from localStorage on initial mount
  useEffect(() => {
    const saved = getStoredHistory();
    setHistory(saved);
    isHydratedRef.current = true;
  }, []);

  // Persist history changes (skipping initial pre-hydration write)
  useEffect(() => {
    if (!isHydratedRef.current) return;
    saveStoredHistory(history);
  }, [history]);

  const addHistoryItem = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, 25));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    setHistory,
    addHistoryItem,
    clearHistory,
  };
}
