// src/hooks/useGameAPI.js
import axios from 'axios';
import { useCallback } from 'react';

export default function useGameAPI(API_URL, strategy) {
  const startGame = useCallback(async pickedColor => {
    const res = await axios.post(`${API_URL}/start-game`, {
      ai_strategy: strategy,
      user_color: pickedColor,
    });
    return res.data;
  }, [API_URL, strategy]);

  const postMove = useCallback(async ({ gameId, row, col, player }) => {
    const res = await axios.post(`${API_URL}/move/${strategy}`, {
      game_id: gameId,
      row,
      col,
      player,
    });
    return res.data;
  }, [API_URL, strategy]);

  return { startGame, postMove };
}
