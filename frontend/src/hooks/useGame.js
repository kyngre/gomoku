import { useState } from 'react';
import { COLORS, GAME_RESULT } from '../constants';
import { useBoardState } from './useBoardState';
import { useMoveHistory } from './useMoveHistory';
import { usePlayerTurn } from './usePlayerTurn';
import { useGameStatus } from './useGameStatus';
import { useGameApi } from './useGameApi';

// 게임 로직과 상태를 통합 관리하는 커스텀 Hook
export function useGame(strategy) {
  const [gameId, setGameId] = useState(null);
  const [userColor, setUserColor] = useState(COLORS.BLACK);
  const [aiColor, setAiColor] = useState(COLORS.WHITE);
  const [resultType, setResultType] = useState(null); // 'user_win', 'ai_win', 'draw', null

  const boardState = useBoardState();
  const moveHistory = useMoveHistory();
  const turnState = usePlayerTurn(userColor, aiColor);
  const status = useGameStatus();
  const api = useGameApi(strategy);

  const startGame = async (pickedColor) => {
    status.startGameStatus();
    boardState.resetBoard();
    moveHistory.resetMoves();
    status.setChoice(pickedColor);
    setResultType(null);

    const data = await api.startGameApi(pickedColor);
    setGameId(data.game_id);
    setUserColor(data.user_color);
    setAiColor(data.ai_color);

    if (data.first_ai_move) {
      const { row, col, player } = data.first_ai_move;
      boardState.placeStone(row, col, player);
      moveHistory.addMove({ row, col, player });
      turnState.setTurn(data.user_color);
    } else {
      turnState.resetTurn();
    }
  };

  const makeMove = async (row, col) => {
    if (status.gameOver || turnState.turn !== userColor) return false;
    if (boardState.board[row][col]) return false;

    boardState.placeStone(row, col, userColor);
    moveHistory.addMove({ row, col, player: userColor });
    turnState.setTurn(aiColor);

    try {
      const data = await api.moveApi(gameId, row, col, userColor);

      if (data.ai_move) {
        const { row: aiRow, col: aiCol, player: aiPlayer } = data.ai_move;
        boardState.placeStone(aiRow, aiCol, aiPlayer);
        moveHistory.addMove({ row: aiRow, col: aiCol, player: aiPlayer });
        turnState.setTurn(userColor);
      }

      // 게임 종료 조건 처리
      if (data.result === GAME_RESULT.USER_WIN) {
        status.endGame();
        setResultType('user_win');
      } else if (data.result === GAME_RESULT.AI_WIN) {
        status.endGame();
        setResultType('ai_win');
      } else if (data.result === GAME_RESULT.DRAW) {
        status.endGame();
        setResultType('draw');
      }

      return true;
    } catch (err) {
      turnState.setTurn(userColor);
      console.error('Move failed:', err);
      return false;
    }
  };

  return {
    ...boardState,
    ...moveHistory,
    ...turnState,
    ...status,
    userColor,
    aiColor,
    gameId,
    startGame,
    makeMove,
    resultType, // 'user_win', 'ai_win', 'draw', null
  };
}
