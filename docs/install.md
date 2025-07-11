이 프로젝트는 React 프론트엔드와 Flask 백엔드로 구성되어 있으며, Docker를 통한 통합 실행 환경을 제공합니다.

### Docker Compose로 실행
```bash
docker compose up 
```
### 1. 로컬 실행 조건
- Python 3.9 이상
- Node.js 16 이상

### 2. 프로젝트 클론
```bash
git clone https://github.com/kyngre/gomoku.git
cd gomoku
```

### 3. 가상환경 구성 (선택)
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 4. 백엔드 의존성 설치
```bash
pip install -r requirements.txt
```

### 5. 프론트엔드 설치
```bash
cd frontend
npm install
cd ..
```

### 6. 환경 변수 파일 생성
`.env` 파일을 루트 디렉토리에 생성하고 다음과 같은 내용을 포함:
```
FLASK_ENV=development
DATABASE_URL=sqlite:///gomoku.db
```

### 7. 로컬 실행
**백엔드 실행:**
```bash
python run.py
```

**프론트엔드 실행:**
```bash
cd frontend
npm run dev
```



