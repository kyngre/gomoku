meta = {
    "addr": "github.com/kyngre", 
    "name": "Random AI", 
    "description": "테스트용 랜덤 AI2 이 AI는 단순히 빈 칸 중 하나를 무작위로 선택합니다.",
}


def get_move(board):
    print("test_ai2.get_move() 호출됨")
    print(f"보드 크기: {len(board)}x{len(board[0]) if board else 0}")
    
    # 간단한 첫 번째 빈 자리 찾기
    for row in range(len(board)):
        for col in range(len(board[row])):
            if board[row][col] == 0:
                print(f"test_ai2 반환: ({row}, {col})")
                return row, col
    
    print("test_ai2 기본값 반환: (9, 9)")
    return 9, 9
