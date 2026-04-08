import { useState, useCallback, useRef } from "react";
import type { BoardItem } from "../../types/board";

export function useHistory(initial: BoardItem[]) {
  const historyRef = useRef<BoardItem[][]>([JSON.parse(JSON.stringify(initial))]);
  const indexRef = useRef(0);

  // These are only for re-rendering canUndo/canRedo in the UI
  const [, forceRender] = useState(0);
  const bump = () => forceRender(n => n + 1);

  const saveSnapshot = useCallback((current: BoardItem[]) => {
    // Trim redo tail, push new snapshot
    historyRef.current = [
      ...historyRef.current.slice(0, indexRef.current + 1),
      JSON.parse(JSON.stringify(current)),
    ];
    indexRef.current = historyRef.current.length - 1;
    bump();
  }, []);

  const undo = useCallback((): BoardItem[] | null => {
    if (indexRef.current <= 0) return null;
    indexRef.current -= 1;
    bump();
    return JSON.parse(JSON.stringify(historyRef.current[indexRef.current]));
  }, []);

  const redo = useCallback((): BoardItem[] | null => {
    if (indexRef.current >= historyRef.current.length - 1) return null;
    indexRef.current += 1;
    bump();
    return JSON.parse(JSON.stringify(historyRef.current[indexRef.current]));
  }, []);

  return {
    saveSnapshot,
    undo,
    redo,
    get canUndo() { return indexRef.current > 0; },
    get canRedo() { return indexRef.current < historyRef.current.length - 1; },
  };
}