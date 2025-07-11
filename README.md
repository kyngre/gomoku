# 오목 AI 웹사이트
<img src="https://github.com/user-attachments/assets/6eb693be-ab96-40c4-8537-75a5b5e7c180" width="800"/>

사용자와 인공지능(AI)이 브라우저 상에서 실시간으로 오목 대결을 펼칠 수 있는 웹 애플리케이션입니다. 단순한 룰 기반 오목부터, 학습형 AI에 이르기까지 다양한 난이도로 사용자의 전략적 사고를 자극합니다.

---

## 🎯 프로젝트 목표
- 사용자가 웹 브라우저에서 오목 AI와 대국할 수 있는 웹사이트를 개발합니다.
- 오목의 가장 기본 규칙인 5개의 돌을 가로, 세로, 또는 대각선으로 연속으로 놓으면 승리하는 방식만 따릅니다. 다른 규칙(렌주룰, 금지수 등)은 적용하지 않습니다.

---

## ✨ 주요 기능

### 🎮 사용자 인터페이스
- 직관적인 19x19 오목판 UI (마우스 클릭으로 돌 착수)
- 게임 상태 표시 (마지막 착수 위치, 승패 결과)
- 다시하기 / 홈 버튼
- AI 난이도 선택 옵션 제공
- 사용자 커스텀 알고리즘 등록 기능 (Pull Request 기반)

### 🤖 오목 AI
- 난이도별 AI 착수 전략 제공:
  - 쉬움: 랜덤 착수
  - 보통: 미니맥스 알고리즘
  - 어려움: **사용자의 착수 기록을 학습**해 수를 두는 동적 학습형 AI

### 🌐 웹사이트 구조
- 프론트엔드: React 기반 UI / 인터랙션 중심 구성
- 백엔드: Flask Framework를 활용한 AI 로직 및 게임 상태 관리
- 데이터베이스: MySQL을 통한 사용자 기록 또는 학습 데이터 저장
- 클라이언트-서버 구조 기반 REST API 통신

---

## 🧠 사용자 알고리즘 커스터마이징 지원

**사용자가 자신만의 착수 알고리즘을 구현하고 Pull Request로 제출**할 수 있습니다.  

자세한 내용은 [CONTRIBUTING.md](https://github.com/kyngre/gomoku/blob/main/CONTRIBUTING.md)를 참고하세요.

---

## 🧱 기술 스택
- **Frontend**: React.js, HTML/CSS/JS
- **Backend**: Flask (Python)
- **Database**: MySQL

---

## 📅 개발 일정 

👉 [Notion 타임라인 보러가기](https://www.notion.so/1e640ca128f680cf94efe24874ca58e3?pvs=4)

---

## 🛠️ 향후 개발 계획
- PvP 모드 구현 (사용자 간 실시간 대전)
- 사용자 계정 및 전적 저장 기능
- 리더보드, AI 대전 랭킹 시스템
- UI/UX 개선 및 모바일 최적화

---

## 📄 프로젝트 문서 및 가이드
**[👉 전체 기술 문서 보러가기](https://kyngre.github.io/gomoku/)**

REST API 명세, 설치 가이드 등 상세 내용은 위 링크에서 확인하세요.

---

## 🔗 사용해보기
(배포 URL 예정)

> **GIT READY TO PLAY** — 

