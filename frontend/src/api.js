// src/api.js
import axios from 'axios';
import { API_URL, STRATEGIES, COLORS } from './constants';

export const GameAPI = {
  start: async (strategy, userColor) => {
    return axios.post(`${API_URL}/start-game`, {
      ai_strategy: strategy || STRATEGIES.EASY,
      user_color: userColor
    });
  },

  move: async (strategy, gameId, row, col, player) => {
    return axios.post(`${API_URL}/move/${strategy}`, {
      game_id: gameId,
      row,
      col,
      player
    });
  }
};
