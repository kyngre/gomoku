// src/hooks/usePlayerTurn.js
import { useState } from 'react';
import { COLORS } from '../constants';

// 현재 플레이어 턴 관리를 위한 커스텀 Hook
// 초기 사용자 색상(userColor)은 기본적으로 흑돌(COLORS.BLACK),
// AI 색상(aiColor)은 기본적으로 백돌(COLORS.WHITE)로 설정됩니다.
export function usePlayerTurn(userColor = COLORS.BLACK, aiColor = COLORS.WHITE) {
  // useState Hook을 사용하여 현재 턴 상태를 관리합니다.
  // 초기 턴은 흑돌(COLORS.BLACK)로 설정됩니다.
  const [turn, setTurn] = useState(COLORS.BLACK);

  // 현재 턴을 다음 플레이어로 변경하는 함수입니다.
  // 현재 턴(prev)이 사용자 색상과 같다면 AI 색상으로,
  // 그렇지 않다면 사용자 색상으로 턴을 업데이트합니다.
  const toggleTurn = () => {
    setTurn(prev => (prev === userColor ? aiColor : userColor));
  };

  // 현재 턴을 초기 흑돌 상태로 되돌리는 함수입니다.
  const resetTurn = () => setTurn(COLORS.BLACK);

  // Hook이 반환하는 객체입니다.
  // 현재 턴 상태(turn), 턴 상태 업데이트 함수(setTurn),
  // 턴 변경 함수(toggleTurn), 턴 초기화 함수(resetTurn)를 포함합니다.
  return { turn, setTurn, toggleTurn, resetTurn };
}