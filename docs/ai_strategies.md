이 문서에서는 프로젝트에 포함된 AI 전략들을 설명합니다.

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