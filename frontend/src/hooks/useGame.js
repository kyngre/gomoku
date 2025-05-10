// src/hooks/useGame.js
import { useState } from 'react';
import { COLORS, GAME_RESULT } from '../constants';
import { useBoardState } from './useBoardState';
import { useMoveHistory } from './useMoveHistory';
import { usePlayerTurn } from './usePlayerTurn';
import { useGameStatus } from './useGameStatus';
import { useGameApi } from './useGameApi';

// 게임 로직과 상태를 통합 관리하는 커스텀 Hook
// strategy를 인자로 받아 AI 전략을 useGameApi Hook에 전달합니다.
export function useGame(strategy) {
  // 게임 ID 상태를 관리합니다. 초기값은 null입니다.
  const [gameId, setGameId] = useState(null);
  // 사용자 돌 색상 상태를 관리합니다. 초기값은 흑돌(COLORS.BLACK)입니다.
  const [userColor, setUserColor] = useState(COLORS.BLACK);
  // AI 돌 색상 상태를 관리합니다. 초기값은 백돌(COLORS.WHITE)입니다.
  const [aiColor, setAiColor] = useState(COLORS.WHITE);

  // useBoardState Hook을 사용하여 바둑판 상태와 관련 함수들을 가져옵니다.
  const boardState = useBoardState();
  // useMoveHistory Hook을 사용하여 착수 기록과 관련 함수들을 가져옵니다.
  const moveHistory = useMoveHistory();
  // usePlayerTurn Hook을 사용하여 현재 턴과 관련 함수들을 가져옵니다.
  const turnState = usePlayerTurn(userColor, aiColor);
  // useGameStatus Hook을 사용하여 게임 상태(종료 여부, 선택 색상)와 관련 함수들을 가져옵니다.
  const status = useGameStatus();
  // useGameApi Hook을 사용하여 게임 API 호출 함수들을 가져옵니다.
  const api = useGameApi(strategy);

  // 새 게임을 시작하는 비동기 함수입니다.
  const startGame = async (pickedColor) => {
    // 게임 상태를 시작 상태로 설정합니다.
    status.startGameStatus();
    // 바둑판을 초기화합니다.
    boardState.resetBoard();
    // 착수 기록을 초기화합니다.
    moveHistory.resetMoves();
    // 사용자가 선택한 돌 색상을 설정합니다.
    status.setChoice(pickedColor);

    // 서버에 새 게임 시작 API를 호출하고 응답 데이터를 받습니다.
    const data = await api.startGameApi(pickedColor);
    // 받은 데이터에서 게임 ID를 설정합니다.
    setGameId(data.game_id);
    // 받은 데이터에서 사용자 돌 색상을 설정합니다.
    setUserColor(data.user_color);
    // 받은 데이터에서 AI 돌 색상을 설정합니다.
    setAiColor(data.ai_color);

    // AI가 첫 수를 두는 경우,
    if (data.first_ai_move) {
      const { row, col, player } = data.first_ai_move;
      // 바둑판에 AI의 첫 수를 놓습니다.
      boardState.placeStone(row, col, player);
      // 착수 기록에 AI의 첫 수를 추가합니다.
      moveHistory.addMove({ row, col, player });
      // 턴을 사용자 색상으로 설정합니다.
      turnState.setTurn(data.user_color);
    } else {
      // AI가 첫 수를 두지 않는 경우, 턴을 초기 흑돌로 설정합니다.
      turnState.resetTurn();
    }
  };

  // 사용자의 착수를 처리하는 비동기 함수입니다.
  const makeMove = async (row, col) => {
    // 게임이 종료되었거나 현재 턴이 사용자 턴이 아니면 착수를 무시하고 false를 반환합니다.
    if (status.gameOver || turnState.turn !== userColor) return false;
    // 착수하려는 자리에 이미 돌이 놓여 있다면 착수를 무시하고 false를 반환합니다.
    if (boardState.board[row][col]) return false;

    // 바둑판에 사용자의 돌을 놓습니다.
    boardState.placeStone(row, col, userColor);
    // 착수 기록에 사용자 착수를 추가합니다.
    moveHistory.addMove({ row, col, player: userColor });
    // 턴을 AI 색상으로 변경합니다.
    turnState.setTurn(aiColor);

    try {
      // 서버에 사용자 착수 API를 호출하고 응답 데이터를 받습니다.
      const data = await api.moveApi(gameId, row, col, userColor);

      // AI가 응수를 한 경우,
      if (data.ai_move) {
        const { row: aiRow, col: aiCol, player: aiPlayer } = data.ai_move;
        // 바둑판에 AI의 응수를 놓습니다.
        boardState.placeStone(aiRow, aiCol, aiPlayer);
        // 착수 기록에 AI의 응수를 추가합니다.
        moveHistory.addMove({ row: aiRow, col: aiCol, player: aiPlayer });
        // 턴을 사용자 색상으로 변경합니다.
        turnState.setTurn(userColor);
      }

      // 게임 종료 조건(사용자 승리 또는 AI 승리)을 확인하고,
      if ([GAME_RESULT.USER_WIN, GAME_RESULT.AI_WIN].includes(data.result)) {
        // 게임 상태를 종료 상태로 설정합니다.
        status.endGame();
      }
      // 착수 처리 성공을 알립니다.
      return true;
    } catch (err) {
      // API 호출 실패 시 턴을 사용자 턴으로 롤백합니다.
      turnState.setTurn(userColor);
      console.error('Move failed:', err);
      // 착수 처리 실패를 알립니다.
      return false;
    }
  };

  // Hook이 반환하는 객체입니다.
  return {
    // 상태
    ...boardState,   // 바둑판 상태 관련 (board, setBoard, resetBoard, placeStone)
    ...moveHistory,  // 착수 기록 관련 (moves, setMoves, addMove, resetMoves, moveNumbers)
    ...turnState,    // 턴 관련 (turn, setTurn, toggleTurn, resetTurn)
    ...status,       // 게임 상태 관련 (gameOver, setGameOver, endGame, startGameStatus, choice, setChoice)
    userColor,       // 사용자 돌 색상
    aiColor,         // AI 돌 색상
    gameId,          // 게임 ID
    // 메서드
    startGame,       // 게임 시작 함수
    makeMove,        // 착수 함수
  };
}