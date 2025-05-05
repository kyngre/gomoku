def check_win(board, x, y, player):
    color = 1 if player == "black" else 2
    directions = [(1,0), (0,1), (1,1), (1,-1)]

    for dx, dy in directions:
        cnt = 1
        for dir in [1, -1]:
            nx, ny = x + dir*dx, y + dir*dy
            while 0 <= nx < len(board) and 0 <= ny < len(board[0]) and board[nx][ny] == color:
                cnt += 1
                nx += dir * dx
                ny += dir * dy
        if cnt >= 5:
            return True
    return False
