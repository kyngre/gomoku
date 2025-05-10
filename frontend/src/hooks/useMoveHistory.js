// src/hooks/useMoveHistory.js
import { useState, useMemo } from 'react';
import { createMoveNumberMap } from '../utils';

// 착수 기록 및 착수 번호 관리를 위한 커스텀 Hook
export function useMoveHistory() {
  // useState Hook을 사용하여 착수 기록 상태를 관리합니다.
  // 초기 상태는 빈 배열입니다. 각 착수 정보는 객체 형태로 저장될 것입니다.
  const [moves, setMoves] = useState([]);

  // 새로운 착수 정보를 착수 기록 배열에 추가하는 함수입니다.
  // 이전 착수 기록(prev)을 복사하여 새로운 착수 정보를 추가한 새 배열로 상태를 업데이트합니다.
  const addMove = (move) => setMoves(prev => [...prev, move]);

  // 착수 기록 배열을 초기 빈 상태로 되돌리는 함수입니다.
  const resetMoves = () => setMoves([]);

  // useMemo Hook을 사용하여 착수 번호 맵(Map 객체)을 생성하고 캐싱합니다.
  // moves 배열이 변경될 때만 createMoveNumberMap 함수를 다시 호출하여 moveNumbers를 업데이트합니다.
  // createMoveNumberMap 함수는 착수 기록(moves)을 기반으로 각 돌의 착수 순서를 key-value 형태로 저장하는 Map 객체를 반환합니다.
  const moveNumbers = useMemo(() => createMoveNumberMap(moves), [moves]);

  // Hook이 반환하는 객체입니다.
  // 착수 기록 배열(moves), 착수 기록 업데이트 함수(setMoves), 착수 추가 함수(addMove),
  // 착수 기록 초기화 함수(resetMoves), 착수 번호 맵(moveNumbers)을 포함합니다.
  return { moves, setMoves, addMove, resetMoves, moveNumbers };
}