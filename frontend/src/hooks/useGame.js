import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_URL, BOARD_SIZE, CELL_SIZE, COLORS, LETTERS } from '../constants';
import { createEmptyBoard, getPositionLabel } from '../utils';

export const useGame = (strategy) => {
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(createEmptyBoard());
  const [moves, setMoves] = useState([]);
  const [userColor, setUserColor] = useState(COLORS.BLACK);
  const [aiColor, setAiColor] = useState(COLORS.WHITE);
  const [turn, setTurn] = useState(COLORS.BLACK);
  const [gameOver, setGameOver] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ row: null, col: null });

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setMoves([]);
    setGameOver(false);
    setHoverPosition({ row: null, col: null });
  }, []);

  const startGame = useCallback(async (pickedColor) => {
    try {
      resetGame();
      const { data } = await axios.post(`${API_URL}/start-game`, {
        ai_strategy: strategy || 'easy',
        user_color: pickedColor
      });

      setGameId(data.game_id);
      setUserColor(data.user_color);
      setAiColor(data.ai_color);

      if (data.first_ai_move) {
        const { row, col, player } = data.first_ai_move;
        setBoard(prev => {
          const newBoard = prev.map(r => [...r]);
          newBoard[row][col] = player;
          return newBoard;
        });
        setMoves([data.first_ai_move]);
        setTurn(data.user_color);
      } else {
        setTurn(COLORS.BLACK);
      }
    } catch (error) {
      console.error('Game start failed:', error);
      throw error;
    }
  }, [strategy, resetGame]);

  const makeMove = useCallback(async (row, col) => {
    if (gameOver || turn !== userColor) return;

    // 유저 착수
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = userColor;
    setBoard(newBoard);
    setMoves(prev => [...prev, { row, col, player: userColor }]);

    try {
      const { data } = await axios.post(`${API_URL}/move/${strategy}`, {
        game_id: gameId,
        row,
        col,
        player: userColor
      });

      // AI 응수
      if (data.ai_move) {
        const { row: aiRow, col: aiCol, player: aiPlayer } = data.ai_move;
        const aiBoard = newBoard.map(r => [...r]);
        aiBoard[aiRow][aiCol] = aiPlayer;
        setBoard(aiBoard);
        setMoves(prev => [...prev, data.ai_move]);
      }

      if (data.result === 'user_win' || data.result === 'ai_win') {
        setGameOver(true);
      }

      setTurn(prev => (prev === userColor ? aiColor : userColor));
    } catch (error) {
      console.error('Move failed:', error);
      // 롤백
      const rollbackBoard = board.map(r => [...r]);
      rollbackBoard[row][col] = null;
      setBoard(rollbackBoard);
      setMoves(prev => prev.slice(0, -1));
      throw error;
    }
  }, [gameId, board, userColor, aiColor, turn, gameOver, strategy]);

  const moveNumbers = useMemo(() => 
    new Map(moves.map((move, index) => [`${move.row}-${move.col}`, index + 1])),
    [moves]
  );

  return {
    gameState: {
      board,
      moves,
      turn,
      userColor,
      aiColor,
      gameOver,
      hoverPosition,
      moveNumbers
    },
    actions: {
      startGame,
      makeMove,
      setHoverPosition
    }
  };
};
