# contribution.md

## 🤝 개발 및 기여 가이드

이 문서는 개발자가 이 프로젝트에 기여하는 방법을 안내합니다.

---

### 1. 로컬 개발 환경 설정

```bash
git clone https://github.com/kyngre/gomoku.git
cd gomoku
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd frontend
npm install
```

**백엔드 실행:**
```bash
python run.py
```
**프론트엔드 실행:**
```bash
cd frontend
npm run dev
```

---

### 2. 브랜치 전략

- `main`: 안정된 배포용 브랜치
- `dev`: 통합 개발 브랜치 (기능 개발 병합 전용)
- `feature/xxx`: 각 기능별 브랜치

예시:
```
feature/add-user-strategy-upload
```

---

### 3. 커밋 메시지 규칙 (Conventional Commits)

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `refactor`: 리팩토링
- `test`: 테스트 관련 작업
- `chore`: 빌드/환경 설정 등 잡일

**예:**
```
feat: CNN 전략 호출 기능 추가
fix: 승리 조건 체크 오류 수정
```

---

### 4. Pull Request 가이드

- PR 제목은 기능 단위로 명확하게 작성
- 관련 이슈가 있을 경우 연결 (`Fixes #issue_number`)
- 리뷰 후 `dev` 브랜치로 병합

---

### 5. 코드 스타일

- Python: `black`, `flake8`, `isort` 사용 권장
- JavaScript/React: `prettier`, `eslint` 사용 권장

---

### 6. 테스트 (선택사항)

- 주요 로직에는 간단한 단위 테스트를 작성합니다.
- 예: `pytest` 기반의 테스트 추가

---

기여해 주셔서 감사합니다! 🙌