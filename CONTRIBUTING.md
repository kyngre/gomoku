# 사용자 AI PR 기여 가이드

## 개요
본 프로젝트는 사용자가 직접 AI 알고리즘을 작성하여 PR(Pull Request)로 제출할 수 있도록 지원합니다. 제출된 AI는 자동으로 백엔드에 반영되어 프론트엔드에서 목록 확인 및 대국이 가능합니다.


<img src="https://github.com/user-attachments/assets/975902f3-2beb-4293-925d-34cf23fd94a6">

---

## 1. PR 파일 작성 규칙

- `gomoku/backend/app/strategies/contributions/` 폴더에 새로운 `.py` 파일을 생성합니다.
- 파일명은 본인의 github id를 사용합니다. 예: `kyngre.py`
- 파일 내에는 반드시 아래 구조를 포함해야 합니다:

```python
meta = {
    "addr": "github.com/your-username",  # GitHub 프로필 또는 레포 주소
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
- Fork & Clone: 프로젝트를 Fork해서 내 계정으로 가져온 뒤, 로컬 PC로 Clone합니다.
- 브랜치 생성 & 파일 추가: 새 브랜치를 만들고 `gomoku/backend/app/strategies/contributions/`에 `.py` 파일을 넣습니다.
- 커밋 & 푸시: 변경 사항을 커밋(Commit)하고 내 GitHub 저장소로 푸시(Push)합니다.
- PR 생성: GitHub에서 Pull Request를 생성하고 [pull_request_template_algorithm.md](https://github.com/kyngre/gomoku/blob/main/.github/PULL_REQUEST_TEMPLATE/pull_request_template_algorithm.md) 파일을 참조하여 양식에 맞춰 작성해주세요.
- 승인 & 반영: PR이 승인되어 병합되면, 알고리즘이 자동으로 프론트엔드에 반영됩니다.



