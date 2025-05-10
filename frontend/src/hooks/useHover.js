// src/hooks/useHover.js
import { useState, useCallback } from 'react';
import { getBoardCoords } from '../utils';

// 마우스 호버링 상태 관리를 위한 커스텀 Hook
export function useHover() {
  // useState Hook을 사용하여 호버링된 행(hoverRow) 상태를 관리합니다.
  // 초기 상태는 null입니다.
  const [hoverRow, setHoverRow] = useState(null);

  // useState Hook을 사용하여 호버링된 열(hoverCol) 상태를 관리합니다.
  // 초기 상태는 null입니다.
  const [hoverCol, setHoverCol] = useState(null);

  // useCallback Hook을 사용하여 마우스 이동 이벤트 핸들러 함수를 생성하고 메모이제이션합니다.
  // 의존성 배열이 비어있으므로 컴포넌트가 처음 렌더링될 때만 함수가 생성됩니다.
  const handleMouseMove = useCallback((e) => {
    // 이벤트가 발생한 요소의 경계 사각형 정보를 가져옵니다.
    const rect = e.currentTarget.getBoundingClientRect();
    // utils의 getBoardCoords 함수를 사용하여 마우스 좌표를 바둑판 좌표(행, 열)로 변환합니다.
    const { row, col } = getBoardCoords(e.clientX, e.clientY, rect);
    // 호버링된 행 상태를 업데이트합니다.
    setHoverRow(row);
    // 호버링된 열 상태를 업데이트합니다.
    setHoverCol(col);
  }, []);

  // useCallback Hook을 사용하여 마우스 떠남 이벤트 핸들러 함수를 생성하고 메모이제이션합니다.
  // 의존성 배열이 비어있으므로 컴포넌트가 처음 렌더링될 때만 함수가 생성됩니다.
  const handleMouseLeave = useCallback(() => {
    // 호버링된 행 상태를 null로 설정하여 호버링 상태를 해제합니다.
    setHoverRow(null);
    // 호버링된 열 상태를 null로 설정하여 호버링 상태를 해제합니다.
    setHoverCol(null);
  }, []);

  // Hook이 반환하는 객체입니다.
  // 호버링된 행 상태(hoverRow), 호버링된 열 상태(hoverCol),
  // 마우스 이동 이벤트 핸들러(handleMouseMove), 마우스 떠남 이벤트 핸들러(handleMouseLeave)를 포함합니다.
  return { hoverRow, hoverCol, handleMouseMove, handleMouseLeave };
}