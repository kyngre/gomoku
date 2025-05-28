# 사용자 AI PR 기여 가이드

## 개요
본 프로젝트는 사용자가 직접 AI 알고리즘을 작성하여 PR(Pull Request)로 제출할 수 있도록 지원합니다. 제출된 AI는 자동으로 백엔드에 반영되어 프론트엔드에서 목록 확인 및 대국이 가능합니다.

<img src="https://github.com/user-attachments/assets/975902f3-2beb-4293-925d-34cf23fd94a6" width="80%">

---

## 1. PR 파일 작성 규칙

- `app/strategies/contributions/` 폴더에 새로운 `.py` 파일을 생성합니다.
- 파일명은 본인의 github id를 사용합니다. 예: `kyngre.py`
- 파일 내에는 반드시 아래 구조를 포함해야 합니다:

```python
meta = {
    "id": "github.com/your-username",  # GitHub 프로필 또는 레포 주소
    "name": "Your AI Name",            # AI 이름
    "description": "AI에 대한 간단한 설명",
}

def get_move(board):
    """
    오목 AI의 다음 수를 결정하는 함수

    Args:
        board: 19x19 2D 리스트
               0 = 빈칸, 1 = 흑돌, 2 = 백돌

    Returns:
        tuple: (row, col) 형태의 좌표 (0-18 범위)
    """
    # 여기에 알고리즘 구현
    return row, col
```

- `get_move` 함수는 반드시 `(row, col)` 튜플을 반환해야 하며, 보드 상태는 19x19 2차원 배열입니다.

---

## 2. PR 제출 절차

- 작성한 AI 파일을 프로젝트의 `app/strategies/contributions/` 폴더에 추가하여 PR을 생성합니다.
- PR이 승인되어 머지되면, 자동으로 알고리즘을 인식하여 프론트엔드에 반영됩니다.

---

## 3. PR 후 동작

- 프론트엔드의 사용자 AI 목록 페이지에서 새로 등록된 AI를 확인할 수 있습니다.
- "대국하기" 버튼을 통해 해당 AI와 대국을 시작할 수 있습니다.
- 게임 페이지에서는 AI 이름, 설명, GitHub 링크 등이 표시됩니다.

---

## 4. 주의사항

- 무한 루프나 과도한 연산을 피하고, 효율적인 알고리즘을 작성해주세요.
- 파일명과 `meta['id']`는 고유해야 하며, 중복 시 문제가 발생할 수 있습니다.
- PR 제출 전 충분한 테스트를 권장합니다.

---

## 5. 예시

```python
meta = {
    "id": "github.com/username/my_ai",
    "name": "MyAwesomeAI",
    "description": "중앙 우선 전략 AI",
}

def get_move(board):
    # 간단한 중앙 우선 전략
    center = 9
    for distance in range(10):
        for row in range(max(0, center-distance), min(19, center+distance+1)):
            for col in range(max(0, center-distance), min(19, center+distance+1)):
                if board[row][col] == 0:
                    return row, col
    return 9, 9
```

---

