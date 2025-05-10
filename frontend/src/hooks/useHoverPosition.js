// src/hooks/useHoverPosition.js
import { useState, useCallback } from 'react';

export default function useHoverPosition(size, cell, board, isUserTurn) {
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);

  // AI 턴이면 즉시 리턴 -> 호버 미표시
  const onMouseMove = useCallback(e => {
    if (!isUserTurn) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const col = Math.round((e.clientX - left) / cell);
    const row = Math.round((e.clientY - top) / cell);
    if (
      row >= 0 && row < size &&
      col >= 0 && col < size &&
      !board[row][col]
    ) {
      setHoverRow(row);
      setHoverCol(col);
    } else {
      setHoverRow(null);
      setHoverCol(null);
    }
  }, [size, cell, board, isUserTurn]);

  const onMouseLeave = useCallback(() => {
    setHoverRow(null);
    setHoverCol(null);
  }, []);

  return { hoverRow, hoverCol, onMouseMove, onMouseLeave };
}
