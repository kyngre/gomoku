from app.models import Move

# 1. 보드 상태 복원
def reconstruct_board(game_id, size=19):
    board = [[None for _ in range(size)] for _ in range(size)]
    moves = Move.query.filter_by(game_id=game_id).order_by(Move.id).all()

    for move in moves:
        board[move.move_y][move.move_x] = move.player

    return board

# 2. 승리 여부 판정
def check_win(board, last_row, last_col, player, size=19):
    directions = [
        (0, 1),   # 가로
        (1, 0),   # 세로
        (1, 1),   # 대각 ↘
        (1, -1),  # 대각 ↙
    ]

    def count(dx, dy):
        cnt = 0
        x, y = last_col, last_row
        while 0 <= x < size and 0 <= y < size and board[y][x] == player:
            cnt += 1
            x += dx
            y += dy
        return cnt - 1  # 중복된 기준점 제외

    for dx, dy in directions:
        total = 1 + count(dx, dy) + count(-dx, -dy)
        if total >= 5:
            return True

    return False
