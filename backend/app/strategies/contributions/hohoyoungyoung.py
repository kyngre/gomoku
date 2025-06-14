meta = {
    "addr": "github.com/your-username",
    "name": "AlphaMind AI",
    "description": "알파-베타 탐색 기반 고성능 오목 AI. 수비와 공격을 동시에 고려하며 트롤을 압도합니다.",
}

import numpy as np
import copy

def get_move(board):
    board = np.array(board)
    if np.sum(board) == 0:
        return (9, 9)

    best_score = float('-inf')
    best_move = (9, 9)  # 기본값

    for move in get_candidate_moves(board):
        new_board = board.copy()
        new_board[move] = 1
        score = alphabeta(new_board, depth=2, alpha=float('-inf'), beta=float('inf'), maximizing=False)
        if score > best_score:
            best_score = score
            best_move = move

    return best_move

def alphabeta(board, depth, alpha, beta, maximizing):
    if depth == 0 or is_terminal(board):
        return evaluate_board(board)

    player = 1 if maximizing else 2
    moves = get_candidate_moves(board)

    if maximizing:
        max_eval = float('-inf')
        for move in moves:
            new_board = board.copy()
            new_board[move] = player
            eval = alphabeta(new_board, depth - 1, alpha, beta, False)
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        return max_eval
    else:
        min_eval = float('inf')
        for move in moves:
            new_board = board.copy()
            new_board[move] = player
            eval = alphabeta(new_board, depth - 1, alpha, beta, True)
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break
        return min_eval

def get_candidate_moves(board):
    moves = set()
    for i in range(19):
        for j in range(19):
            if board[i][j] != 0:
                for dx in range(-2, 3):
                    for dy in range(-2, 3):
                        ni, nj = i + dx, j + dy
                        if 0 <= ni < 19 and 0 <= nj < 19 and board[ni][nj] == 0:
                            moves.add((ni, nj))
    return list(moves)

def is_terminal(board):
    for i in range(19):
        for j in range(19):
            if board[i][j] != 0:
                player = board[i][j]
                if check_five(board, i, j, player):
                    return True
    return False

def check_five(board, i, j, player):
    directions = [(1,0), (0,1), (1,1), (1,-1)]
    for dx, dy in directions:
        count = 1
        for k in range(1, 5):
            ni, nj = i + dx * k, j + dy * k
            if 0 <= ni < 19 and 0 <= nj < 19 and board[ni][nj] == player:
                count += 1
            else:
                break
        for k in range(1, 5):
            ni, nj = i - dx * k, j - dy * k
            if 0 <= ni < 19 and 0 <= nj < 19 and board[ni][nj] == player:
                count += 1
            else:
                break
        if count >= 5:
            return True
    return False

def evaluate_board(board):
    score = 0
    patterns = [
        (1000000, [1,1,1,1,1]),
        (10000, [0,1,1,1,1,0]),
        (5000, [1,1,1,1,0]),
        (5000, [0,1,1,1,1]),
        (1000, [0,1,1,1,0]),
        (100, [0,1,1,0]),
        (10, [0,1,0]),
    ]
    for pattern_score, pattern in patterns:
        score += count_pattern(board, pattern, 1) * pattern_score
        score -= count_pattern(board, pattern, 2) * pattern_score * 1.1  # 수비 가중치

    return score

def count_pattern(board, pattern, player):
    count = 0
    pat = [player if p == 1 else 0 for p in pattern]

    def match(line):
        for i in range(len(line) - len(pat) + 1):
            if list(line[i:i+len(pat)]) == pat:
                return True
        return False

    for i in range(19):
        for j in range(19 - len(pattern) + 1):
            if match(board[i, j:j+len(pattern)]): count += 1
            if match(board[j:j+len(pattern), i]): count += 1

    for i in range(19 - len(pattern) + 1):
        for j in range(19 - len(pattern) + 1):
            diag1 = [board[i+k][j+k] for k in range(len(pattern))]
            diag2 = [board[i+k][j+len(pattern)-1-k] for k in range(len(pattern))]
            if match(diag1): count += 1
            if match(diag2): count += 1

    return count
