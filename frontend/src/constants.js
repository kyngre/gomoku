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

export const STRATEGIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const GAME_RESULT = {
  USER_WIN: 'user_win',
  AI_WIN: 'ai_win',
  DRAW: 'draw',
};
