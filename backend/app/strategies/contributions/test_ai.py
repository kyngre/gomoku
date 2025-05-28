meta = {
    "addr": "여기에 github 주소를 입력 ", 
    "name": "여기에 AI 이름을 입력", 
    "description": "여기에 설명을 입력",
}

import random

def get_move(board):
    empty = [
        (i, j)
        for i in range(len(board))
        for j in range(len(board[0]))
        if board[i][j] == 0
    ]
    return random.choice(empty) if empty else None