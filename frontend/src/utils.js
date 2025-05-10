// src/utils.js

import { BOARD_SIZE, COLORS, LETTERS, CELL_SIZE } from './constants';

// 1. 빈 보드 생성
export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(COLORS.NONE));
}

// 2. 좌표 라벨 생성 (ex: A19, K10)
export function getPositionLabel(row, col) {
  return `${LETTERS[col]}${BOARD_SIZE - row}`;
}

// 3. 마우스 좌표 → 보드 좌표 변환
export function getBoardCoords(clientX, clientY, rect) {
  const col = Math.round((clientX - rect.left) / CELL_SIZE);
  const row = Math.round((clientY - rect.top) / CELL_SIZE);
  return { row, col };
}

// 4. 돌 번호 Map 생성 (moves 배열 → Map)
export function createMoveNumberMap(moves) {
  const map = new Map();
  moves.forEach((move, idx) => {
    map.set(`${move.row}-${move.col}`, idx + 1);
  });
  return map;
}

// 5. (선택) 좌표 유효성 검사
export function isValidBoardCoord(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

