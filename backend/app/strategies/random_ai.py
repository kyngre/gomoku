import random

def get_random_move(board):
    empty = [
        (i, j)
        for i in range(len(board))
        for j in range(len(board[0]))
        if board[i][j] == 0
    ]
    return random.choice(empty) if empty else None
