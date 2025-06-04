# ai_strategies.md

## 🧠 AI 전략 설명

이 문서에서는 프로젝트에 포함된 AI 전략들과 사용자 정의 전략을 사용하는 방법을 설명합니다.

---

### 1. 내장 전략

#### 🔹 RandomAI
- 무작위로 빈 칸 중 하나를 선택하여 착수합니다.
- 구현: `app/strategies/random_ai.py`
- 장점: 빠르며 디버깅에 유용함
- 단점: 약한 전략, 실용성 없음

#### 🔹 MinimaxAI
- 미니맥스 알고리즘 기반 전략입니다.
- 구현: `app/strategies/minimax_ai.py`
- 깊이 우선 탐색을 통해 수를 예측하고 최적의 수를 선택합니다.
- 장점: 전략적이며 이기기 쉽지 않음
- 단점: 느릴 수 있음 (계산 복잡도 ↑)

#### 🔹 CNNStrategy
- 딥러닝 모델(CNN)을 활용해 다음 수를 예측합니다.
- 구현: `app/strategies/cnn_strategy.py`
- 모델은 `.h5` 형식의 학습된 가중치를 필요로 합니다 (`mlops/training/models/best.h5`)
- 장점: 패턴 학습 기반으로 직관적인 수를 선택함
- 단점: 학습 품질에 따라 성능 차이 있음

---

### 2. 사용자 정의 전략 업로드

#### 📤 업로드 방식
1. 웹 UI에서 전략 선택 시 "사용자 정의 AI 업로드" 선택
2. `.py` 파일 형식의 전략 파일 업로드
3. 서버는 해당 파일을 `user_ai_scripts/` 디렉토리에 저장

#### 📦 인터페이스 요구사항
- 사용자 전략 파일에는 `get_move(board: list) -> tuple` 함수가 포함되어야 함

#### ✅ 예시 코드
```python
def get_move(board):
    # 예: 가장 왼쪽 빈칸 반환
    for i in range(19):
        for j in range(19):
            if board[i][j] == "":
                return i, j
```

- `board`는 19x19 2차원 리스트이며, 각 칸은 "", "user", "ai" 중 하나입니다.
- 리턴 값은 `(row, col)` 형식의 좌표입니다.

> ⚠️ 사용자 전략은 서버 측에서 보안상 제한된 환경에서 실행되며, 표준 라이브러리 외 의존성은 사용할 수 없습니다.