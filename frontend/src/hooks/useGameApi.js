// src/hooks/useGameApi.js
import axios from 'axios';
import { API_URL, STRATEGIES } from '../constants';

// 게임 API 호출 로직을 담는 커스텀 Hook
// strategy를 인자로 받아 API 호출 시 AI 전략을 설정합니다.
export function useGameApi(strategy) {
  // 새 게임 시작 API를 호출하는 비동기 함수입니다.
  // 사용자가 선택한 돌 색상(pickedColor)을 서버에 전달합니다.
  // strategy가 제공되지 않으면 기본 전략(STRATEGIES.EASY)을 사용합니다.
  const startGameApi = async (pickedColor) => {
    const res = await axios.post(`${API_URL}/start-game`, {
      ai_strategy: strategy || STRATEGIES.EASY,
      user_color: pickedColor
    });
    // 서버로부터 받은 응답 데이터를 반환합니다.
    return res.data;
  };

  // 돌을 놓는 API를 호출하는 비동기 함수입니다.
  // 게임 ID(gameId), 놓을 위치의 행(row)과 열(col), 그리고 플레이어 색상(player)을 서버에 전달합니다.
  // AI 전략(strategy)은 API 엔드포인트에 포함됩니다.
  const moveApi = async (gameId, row, col, player) => {
    const res = await axios.post(`${API_URL}/move/${strategy}`, {
      game_id: gameId,
      row,
      col,
      player
    });
    // 서버로부터 받은 응답 데이터를 반환합니다.
    return res.data;
  };

  // Hook이 반환하는 객체입니다.
  // 새 게임 시작 API 호출 함수(startGameApi)와 돌을 놓는 API 호출 함수(moveApi)를 포함합니다.
  return { startGameApi, moveApi };
}