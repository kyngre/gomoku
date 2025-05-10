// src/hooks/useGameState.js
import { useState, useCallback } from 'react';

export default function useGameState(size = 19) {
  // board: 2D array of null | 'black' | 'white'
  const [board, setBoard] = useState(() =>
    Array.from({ length: size }, () => Array(size).fill(null))
  );
  // moves: array of { row, col, player }
  const [moves, setMoves] = useState([]);
  // turn: 'black' or 'white'
  const [turn, setTurn] = useState('black');

  // placeStone: board & moves 업데이트, 턴 전환은 호출부에서 처리
  const placeStone = useCallback((row, col, player) => {
    setBoard(b => {
      const nb = b.map(r => [...r]);
      nb[row][col] = player;
      return nb;
    });
    setMoves(mv => [...mv, { row, col, player }]);
  }, []);

  // resetGame: 초기화
  const resetGame = useCallback(() => {
    setBoard(Array.from({ length: size }, () => Array(size).fill(null)));
    setMoves([]);
    setTurn('black');
  }, [size]);

  return { board, moves, turn, setTurn, placeStone, resetGame };
}
