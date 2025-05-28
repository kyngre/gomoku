// src/hooks/useGameApi.js 최종 버전

import axios from 'axios';
import { API_URL, STRATEGIES } from '../constants';

export function useGameApi(strategy) {
  const startGameApi = async (pickedColor) => {
    // strategy가 없으면 기본값 사용
    const finalStrategy = strategy || STRATEGIES.EASY;
    
    console.log(`게임 시작 - 전략: ${finalStrategy}, 사용자 색상: ${pickedColor}`);
    
    const res = await axios.post(`${API_URL}/start-game`, {
      ai_strategy: finalStrategy,
      user_color: pickedColor
    });
    return res.data;
  };

  const moveApi = async (gameId, row, col, player) => {
    // strategy가 없으면 기본값 사용
    const finalStrategy = strategy || STRATEGIES.EASY;
    
    console.log(`착수 - 전략: ${finalStrategy}, 게임ID: ${gameId}, 위치: (${row}, ${col})`);
    
    const res = await axios.post(`${API_URL}/move/${finalStrategy}`, {
      game_id: gameId,
      row,
      col,
      player
    });
    return res.data;
  };

  return { startGameApi, moveApi };
}
