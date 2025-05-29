meta = {
    "addr": "https://github.com/hohoyoungyoung",
    "name": "hohohohoho",
    "description": "호호호호호호",
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
    import copy
    from concurrent.futures import ThreadPoolExecutor
    SIZE, ME, ENEMY = 19, 1, 2
    CENTER = SIZE // 2
    directions = [(1, 0), (0, 1), (1, 1), (1, -1)]

    def is_valid(r, c, b):
        return 0 <= r < SIZE and 0 <= c < SIZE and b[r][c] == 0

    def get_line(r, c, dr, dc, b):
        return [
            b[r + i * dr][c + i * dc] if 0 <= r + i * dr < SIZE and 0 <= c + i * dc < SIZE else -1
            for i in range(-5, 6)
        ]

    def detect_pattern(line, pattern):
        for i in range(len(line) - len(pattern) + 1):
            if line[i:i + len(pattern)] == pattern:
                return True
        return False

    def is_open_four(r, c, color, b):
        for dr, dc in directions:
            b[r][c] = color
            line = get_line(r, c, dr, dc, b)
            b[r][c] = 0
            if detect_pattern(line, [0, color, color, color, color, 0]):
                return True
        return False

    def is_closed_four(r, c, color, b):
        for dr, dc in directions:
            b[r][c] = color
            line = get_line(r, c, dr, dc, b)
            b[r][c] = 0
            if detect_pattern(line, [-1, color, color, color, color, 0]) or \
               detect_pattern(line, [0, color, color, color, color, -1]):
                return True
        return False

    def count_open_threes(r, c, color, b):
        count = 0
        for dr, dc in directions:
            b[r][c] = color
            line = get_line(r, c, dr, dc, b)
            b[r][c] = 0
            if detect_pattern(line, [0, color, color, color, 0]):
                count += 1
        return count

    def score_point(r, c, color, b):
        score = 0
        if is_open_four(r, c, color, b): score += 8000
        elif is_closed_four(r, c, color, b): score += 5000
        threes = count_open_threes(r, c, color, b)
        if threes >= 2: score += 4000
        elif threes == 1: score += 2000
        score += max(0, 200 - ((r - CENTER) ** 2 + (c - CENTER) ** 2))  # 중심성
        return score

    def generate_moves(b):
        moves = []
        for r in range(SIZE):
            for c in range(SIZE):
                if is_valid(r, c, b) and any(
                    0 <= r + dr < SIZE and 0 <= c + dc < SIZE and b[r + dr][c + dc] != 0
                    for dr in [-2, -1, 0, 1, 2] for dc in [-2, -1, 0, 1, 2]
                ):
                    s = score_point(r, c, ME, b)
                    moves.append(((r, c), s))
        return [move for move, _ in sorted(moves, key=lambda x: -x[1])][:20]  # top 20 moves

    def alphabeta(b, depth, alpha, beta, maximizing):
        if depth == 0:
            score = 0
            for r in range(SIZE):
                for c in range(SIZE):
                    if b[r][c] == ME:
                        score += score_point(r, c, ME, b)
                    elif b[r][c] == ENEMY:
                        score -= score_point(r, c, ENEMY, b)
            return score

        moves = generate_moves(b)
        if not moves:
            return 0

        if maximizing:
            max_eval = -float('inf')
            for (r, c) in moves:
                b[r][c] = ME
                eval = alphabeta(b, depth - 1, alpha, beta, False)
                b[r][c] = 0
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha: break
            return max_eval
        else:
            min_eval = float('inf')
            for (r, c) in moves:
                b[r][c] = ENEMY
                eval = alphabeta(b, depth - 1, alpha, beta, True)
                b[r][c] = 0
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha: break
            return min_eval

    def score_move(r, c):
        b_copy = copy.deepcopy(board)
        if not is_valid(r, c, b_copy): return -float('inf')
        b_copy[r][c] = ME
        return alphabeta(b_copy, 4, -float('inf'), float('inf'), False)

    candidates = generate_moves(board)
    if not candidates: return (CENTER, CENTER)

    best_score = -float('inf')
    best_move = (CENTER, CENTER)

    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(lambda pos: (score_move(*pos), pos), [m for m, _ in candidates]))

    for score, move in results:
        if score > best_score:
            best_score = score
            best_move = move

    return best_move
