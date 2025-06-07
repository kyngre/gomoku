---
title: API 명세
---

이 문서는 백엔드 Flask 서버가 제공하는 REST API 엔드포인트를 설명합니다.

---

### 🎮 1. POST `/start-game`
- **설명**: 새로운 게임을 생성하고, 첫 수를 반환합니다.
- **요청 본문 예시** (JSON):
```json
{
  "ai_strategy": "minimax",
  "starter": "user"
}
```
- **응답 예시**:
```json
{
  "game_id": 1,
  "board": [["", "", ...]],
  "current_player": "user"
}
```

---

### ⚫ 2. POST `/move/{strategy}`
- **설명**: 사용자가 착수한 후, AI 수를 포함해 다음 상태를 반환합니다.
- **경로 변수**:
  - `{strategy}`: 선택한 AI 전략 이름 (`random`, `minimax`, `cnn`, `user` 등)
- **요청 본문 예시**:
```json
{
  "game_id": 1,
  "row": 10,
  "col": 11,
  "player": "user"
}
```
- **응답 예시**:
```json
{
  "board": [["", "", ...]],
  "winner": null,
  "next_player": "ai"
}
```

---

### 🤖 3. GET `/contributions`
- **설명**: 사용자 정의로 업로드된 AI 전략 목록을 조회합니다.
- **응답 예시**:
```json
[
  "my_custom_ai_1.py",
  "deep_player.py"
]
```

---

### ⚠️ 에러 응답 예시
```json
{
  "error": "Invalid move",
  "detail": "Position already occupied"
}
```

> API 요청은 모두 JSON 형식으로 이루어지며, 응답도 JSON으로 반환됩니다.