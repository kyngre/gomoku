import numpy as np
import copy

def evaluate_board(board, player):
    score = 0
    for i in range(19):
        for j in range(19):
            if j <= 14:
                pattern = board[i, j:j + 5]
                score += get_score_from_pattern(pattern, player)
            if i <= 14:
                pattern = board[i:i + 5, j]
                score += get_score_from_pattern(pattern, player)
            if i <= 14 and j <= 14:
                pattern = np.diag(board[i:i + 5, j:j + 5])
                score += get_score_from_pattern(pattern, player)
            if i <= 14 and j >= 4:
                pattern = np.diag(np.fliplr(board[i:i + 5, j - 4:j + 1]))
                score += get_score_from_pattern(pattern, player)
    return score

def get_score_from_pattern(pattern, player):
    score = 0
    opponent = 1 if player == 2 else 2
    player_count = pattern.tolist().count(player)
    opponent_count = pattern.tolist().count(opponent)

    if opponent_count == 0 and player == 1:
        if player_count == 5:
            score += 1000000
        elif player_count == 4:
            score += 10000
        elif player_count == 3:
            score += 1000
        elif player_count == 2:
            score += 100
        elif player_count == 1:
            score += 10
    
    elif opponent_count == 0 and player == 2:
        if player_count == 5:
            score -= 100000
        elif player_count == 4:
            score -= 10000
        elif player_count == 3:
            score -= 1000
        elif player_count == 2:
            score -= 100
        elif player_count == 1:
            score -= 10

    return score


def get_mini_max_move(board):
    able_positions = set()
    directions = [(1, 0), (0, 1), (1, 1), (1, -1), (-1, 0), (0, -1), (-1, -1), (-1, 1)]

    for i in range(19):
        for j in range(19):
            if board[i, j] != 0:
                for dx, dy in directions:
                    for dist in range(1, 2):
                        nx, ny = i + dx * dist, j + dy * dist
                        if 0 <= nx < 19 and 0 <= ny < 19 and board[nx, ny] == 0:
                            able_positions.add((nx, ny))

    best_score = float('-inf')
    best_move = None

    for x, y in able_positions:
        new_board = copy.deepcopy(board)
        new_board[x, y] = 1
        score1 = evaluate_board(new_board, 1)

        able_positions2 = set()
        for i in range(19):
            for j in range(19):
                if new_board[i, j] != 0:
                    for dx, dy in directions:
                        for dist in range(1, 3):
                            nx, ny = i + dx * dist, j + dy * dist
                            if 0 <= nx < 19 and 0 <= ny < 19 and new_board[nx, ny] == 0:
                                able_positions2.add((nx, ny))

        score2 = 0        
        for nx, ny in able_positions2:
            new_board2 = copy.deepcopy(new_board)
            new_board2[nx, ny] = 2
            score2 = min(score2, evaluate_board(new_board2, 2))
            
        score = score1 + score2
        if score > best_score:
            best_score = score
            best_move = (x, y)

    return best_move