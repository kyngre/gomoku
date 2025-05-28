// src/constants.js

export const API_URL = import.meta.env.VITE_API_URL;

export const BOARD_SIZE = 19;
export const CELL_SIZE = 30;
export const LETTERS = 'ABCDEFGHIJKLMNOPQRS'.split('');
export const WIN_COUNT = 5;

export const COLORS = {
  BLACK: 'black',
  WHITE: 'white',
  NONE: null,
};

// 기본 전략들
export const STRATEGIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// 사용자 AI 여부 확인 함수 추가
export const isUserAI = (strategy) => {
  return strategy && strategy.startsWith('user_');
};

// 전략 유효성 검사 함수 추가
export const isValidStrategy = (strategy) => {
  return Object.values(STRATEGIES).includes(strategy) || isUserAI(strategy);
};

export const GAME_RESULT = {
  USER_WIN: 'user_win',
  AI_WIN: 'ai_win',
  DRAW: 'draw',
};
