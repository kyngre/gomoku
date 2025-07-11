이 문서에서는 Gomoku 프로젝트의 디렉토리 구조 및 주요 구성 요소들을 설명합니다.

---

## 1. 전체 구조
```
gomoku/
├── backend/                      # Flask 백엔드
│   ├── __init__.py           # 앱 팩토리
│   ├── database.py           # DB 연결
│   ├── models.py             # ORM 모델 정의 (Game, Move)
│   ├── utils/check_win.py    # 승리 조건 체크 함수
│   ├── routes/               # API 라우터
│   │   ├── game_routes.py
│   │   ├── move_routes.py
│   │   └── user_ai_routes.py
│   ├── strategies/           # AI 전략 클래스들
│   │   ├── __init__.py
│   │   ├── random_ai.py
│   │   ├── minimax_ai.py
│   │   └── cnn_strategy.py
│   └── contributions/      # 업로드된 사용자 전략
│
├── frontend/               # React 프론트엔드
│   ├── components/           # 게임 보드, 상태창 등
│   ├── hooks/                # 보드 API custom hooks
│   ├── stores/               # 상태 관리
│   └── pages/                # 메인페이지, 플레이페이지 등
│
├── mlops/                    # 모델 학습 및 관리
│   └── training/
│       ├── fine_tuning.py
│       ├── train_data/     # CNN 학습용 데이터
│       └── models/
│           └── *.h5       # CNN 모델 가중치
│
└── docker-compose.yml
```

---

## 2. 주요 역할

### 🔹 Flask 백엔드 (`backend/`)
- API 라우팅: `/routes`
- 게임 및 수 기록 모델: `models.py`
- AI 전략 등록 및 호출: `strategies/`, `strategies/contributions/`
- 유틸리티: `check_win.py` (승부 판정)

### 🔹 React 프론트엔드 (`frontend/`)
- 19x19 오목판 UI, 상태 표시, 전략 선택 등 사용자 인터페이스 구성
- `axios` 기반 API 호출 서비스 존재

### 🔹 AI 학습 (`mlops/`)
- CNN 기반 전략을 위한 데이터 생성 및 학습 코드 포함
- `GitHub Actions`로 자동 학습 설정 가능

### 🔹 설정 및 배포
- `docker-compose.yml` 파일을 통한 환경 통합 설정

> 📌 전체 시스템은 React-Frontend ↔ Flask-API ↔ AI 전략 ↔ DB 구조로 동작합니다.
