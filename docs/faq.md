### Q1. AI 전략은 어떤 기준으로 수를 둡니까?
- **RandomAI**는 무작위로 빈칸을 선택합니다.
- **MinimaxAI**는 상대방 수를 예측하여 가장 유리한 수를 계산합니다.
- **CNNStrategy**는 학습된 모델을 통해 패턴 인식 기반으로 수를 결정합니다.

---

### Q2. 사용자 정의 AI 전략을 Pull Request 했는데 보이지 않아요.
- docker compose build backend 후 다시 docker compose up 해보시기 바랍니다.
- docker-compose.yml의 호스트 ./backend를 컨테이너의 /app에 마운트하여 실시간으로 보이게 업데이트했습니다. (Jun.07.2025)

---

### Q3. 사용자 전략에서 외부 라이브러리를 사용할 수 있나요?
- 아닙니다. 보안상의 이유로 사용자 전략은 표준 라이브러리만 사용할 수 있으며, 별도의 `pip install`은 허용되지 않습니다.

---

### Q4. CNN 모델은 어디서 학습된 것인가요?
- 내부적으로 MLOps 파이프라인(`mlops/`)을 통해 학습된 `.h5` 가중치 파일을 사용합니다.
- 필요 시 `mlops/training/fine_tuning.py`를 실행하여 재학습할 수 있습니다.

---

### Q5. 브라우저에서 게임이 느리게 동작하는데 해결 방법은?
- Minimax 전략은 계산량이 많아 느릴 수 있습니다.
- Random 또는 간단한 사용자 전략을 사용할 경우 속도 향상됩니다.

---

### Q6. GitHub Actions는 어떤 역할을 하나요?
- 주기적으로 CNN 모델을 학습하거나, PR 시 자동 테스트/배포 파이프라인을 실행합니다.
- 설정 위치: `.github/workflows/train.yml`

---

### Q7. 게임 데이터는 어디 저장되나요?
- MySQL 데이터베이스(`gomoku.db`)에 저장됩니다.
- 모델은 `app/models.py`에 정의되어 있으며, `Game`과 `Move` 엔티티로 구성됩니다.