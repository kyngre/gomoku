import random
import numba

meta = {
    "addr": "github.com/eonjong0218",
    "name": "언종의 Jekyll-Hyde AI",
    "description": "천재와 트롤 사이를 오가는 이중인격 오목 AI",
}

def get_move(board):
    import numpy as np
    board_array = np.array(board, dtype=np.int32)
    
    personality = random.choice([0, 1])  # 0: jekyll, 1: hyde

    if personality == 0:
        return jekyll_mode_jit(board_array)
    else:
        return hyde_mode_jit(board_array)

@numba.jit(nopython=True, cache=True)
def jekyll_mode_jit(board):
    winning_move = find_winning_move_jit(board, 1)
    if winning_move[0] != -1:
        return winning_move

    blocking_move = find_winning_move_jit(board, 2)
    if blocking_move[0] != -1:
        return blocking_move

    four_move = find_pattern_move_jit(board, 1, 4)
    if four_move[0] != -1:
        return four_move

    block_four = find_pattern_move_jit(board, 2, 4)
    if block_four[0] != -1:
        return block_four

    three_move = find_pattern_move_jit(board, 1, 3)
    if three_move[0] != -1:
        return three_move

    return get_center_move_jit(board)

@numba.jit(nopython=True, cache=True)
def hyde_mode_jit(board):
    troll_moves = find_troll_moves_jit(board)
    
    if len(troll_moves) > 0:
        idx = random.randint(0, len(troll_moves) - 1)
        return troll_moves[idx]
    
    return get_random_move_jit(board)

@numba.jit(nopython=True, cache=True)
def find_winning_move_jit(board, player):
    directions = [(0,1), (1,0), (1,1), (1,-1)]
    
    for row in range(19):
        for col in range(19):
            if board[row][col] == 0:
                for i in range(4):
                    dr, dc = directions[i]
                    count = count_line_jit(board, row, col, dr, dc, player)
                    if count >= 5:
                        return (row, col)
    return (-1, -1)

@numba.jit(nopython=True, cache=True)
def find_pattern_move_jit(board, player, target_count):
    directions = [(0,1), (1,0), (1,1), (1,-1)]
    
    for row in range(19):
        for col in range(19):
            if board[row][col] == 0:
                for i in range(4):
                    dr, dc = directions[i]
                    count = count_line_jit(board, row, col, dr, dc, player)
                    if count == target_count:
                        return (row, col)
    return (-1, -1)

@numba.jit(nopython=True, cache=True)
def count_line_jit(board, row, col, dr, dc, player):
    count = 1
    
    r, c = row + dr, col + dc
    while 0 <= r < 19 and 0 <= c < 19 and board[r][c] == player:
        count += 1
        r, c = r + dr, c + dc
    
    r, c = row - dr, col - dc
    while 0 <= r < 19 and 0 <= c < 19 and board[r][c] == player:
        count += 1
        r, c = r - dr, c - dc
    
    return count

@numba.jit(nopython=True, cache=True)
def find_troll_moves_jit(board):
    troll_moves = []
    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    
    for row in range(19):
        for col in range(19):
            if board[row][col] == 2:
                for i in range(8):
                    dr, dc = directions[i]
                    r, c = row + dr, col + dc
                    if 0 <= r < 19 and 0 <= c < 19 and board[r][c] == 0:
                        is_duplicate = False
                        for j in range(len(troll_moves)):
                            if troll_moves[j][0] == r and troll_moves[j][1] == c:
                                is_duplicate = True
                                break
                        if not is_duplicate:
                            troll_moves.append((r, c))
    
    return troll_moves

@numba.jit(nopython=True, cache=True)
def get_center_move_jit(board):
    center = 9
    
    if board[center][center] == 0:
        return (center, center)
    
    for distance in range(1, 10):
        candidates = []
        for row in range(max(0, center-distance), min(19, center+distance+1)):
            for col in range(max(0, center-distance), min(19, center+distance+1)):
                if board[row][col] == 0:
                    candidates.append((row, col))
        
        if len(candidates) > 0:
            return candidates[0]
    
    return get_random_move_jit(board)

@numba.jit(nopython=True, cache=True)
def get_random_move_jit(board):
    empty_spots = []
    for row in range(19):
        for col in range(19):
            if board[row][col] == 0:
                empty_spots.append((row, col))
    
    if len(empty_spots) > 0:
        return empty_spots[0]
    
    return (0, 0)

def warmup_jit():
    import numpy as np
    dummy_board = np.zeros((19, 19), dtype=np.int32)
    dummy_board[9][9] = 1
    dummy_board[9][10] = 2
    
    jekyll_mode_jit(dummy_board)
    hyde_mode_jit(dummy_board)
    find_winning_move_jit(dummy_board, 1)
    find_pattern_move_jit(dummy_board, 1, 3)
    count_line_jit(dummy_board, 9, 8, 0, 1, 1)

try:
    warmup_jit()
except:
    pass