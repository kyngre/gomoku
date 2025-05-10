// src/hooks/useBoardState.js
import { useState } from 'react';
import { createEmptyBoard } from '../utils';

// 바둑판 상태 관리를 위한 커스텀 Hook
export function useBoardState() {
  // useState Hook을 사용하여 바둑판 상태를 관리합니다.
  // 초기 상태는 utils 폴더의 createEmptyBoard 함수를 호출하여 생성된 빈 바둑판입니다.
  const [board, setBoard] = useState(createEmptyBoard());

  // 바둑판을 초기 빈 상태로 되돌리는 함수입니다.
  const resetBoard = () => setBoard(createEmptyBoard());

  // 특정 위치(row, col)에 주어진 색깔(color)의 돌을 놓는 함수입니다.
  const placeStone = (row, col, color) => {
    // setBoard 함수를 사용하여 상태를 업데이트합니다.
    // 이전 상태(prev)를 기반으로 새로운 바둑판 상태(next)를 생성합니다.
    setBoard(prev => {
      // 이전 바둑판의 각 행을 복사하여 새로운 2차원 배열을 만듭니다.
      const next = prev.map(r => [...r]);
      // 주어진 행(row)과 열(col)에 해당하는 위치에 돌의 색깔(color)을 설정합니다.
      next[row][col] = color;
      // 새로운 바둑판 상태를 반환하여 상태를 업데이트합니다.
      return next;
    });
  };

  // Hook이 반환하는 객체입니다.
  // 바둑판 상태(board), 상태 업데이트 함수(setBoard), 바둑판 초기화 함수(resetBoard),
  // 특정 위치에 돌을 놓는 함수(placeStone)를 포함합니다.
  return { board, setBoard, resetBoard, placeStone };
}