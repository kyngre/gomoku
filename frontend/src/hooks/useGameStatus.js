// src/hooks/useGameStatus.js
import { useState } from 'react';

// 게임 상태(종료 여부, 사용자 선택) 관리를 위한 커스텀 Hook
export function useGameStatus() {
  // useState Hook을 사용하여 게임 종료 상태를 관리합니다.
  // 초기 상태는 false (게임 진행 중)입니다.
  const [gameOver, setGameOver] = useState(false);

  // useState Hook을 사용하여 사용자 색상 선택 상태를 관리합니다 ('black' 또는 'white').
  // 초기 상태는 null (색상 미선택)입니다.
  const [choice, setChoice] = useState(null);

  // 게임을 종료 상태로 변경하는 함수입니다.
  const endGame = () => setGameOver(true);

  // 게임을 시작 상태 (진행 중)로 변경하는 함수입니다.
  const startGameStatus = () => setGameOver(false);

  // Hook이 반환하는 객체입니다.
  // 게임 종료 여부 상태(gameOver), 게임 종료 상태 업데이트 함수(setGameOver),
  // 게임 종료 함수(endGame), 게임 시작 함수(startGameStatus),
  // 사용자 색상 선택 상태(choice), 사용자 색상 선택 업데이트 함수(setChoice)를 포함합니다.
  return { gameOver, setGameOver, endGame, startGameStatus, choice, setChoice };
}