def check_draw(board):
    for row in board:
        if 0 in row:  # 0이 빈 칸을 의미
            return False
    return True
