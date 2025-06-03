import numpy as np
from tensorflow.keras.models import load_model
import tensorflow as tf
import os

# try:
#     model = load_model('./app/strategies/model_weight/best.h5')
#     print("모델 로드 성공")
# except Exception as e:
#     print("모델 로딩 실패:", e)


MODEL_DIR = 'gomoku/mlops/training/models'
DEFAULT_MODEL_PATH = './app/strategies/model_weight/best.h5'

# 1. 가장 최근 모델 경로를 찾는 lambda
get_latest_model = lambda: max(
    [os.path.join(MODEL_DIR, f) for f in os.listdir(MODEL_DIR) if f.endswith('.h5')],
    key=os.path.getctime
) if os.path.exists(MODEL_DIR) and any(f.endswith('.h5') for f in os.listdir(MODEL_DIR)) else DEFAULT_MODEL_PATH

# 2. 모델 로드 시도
try:
    model_path = get_latest_model()
    model = load_model(model_path)
    print(f"모델 로드 성공: {model_path}")
    print(f"모델 로드 성공: {model_path}")
except Exception as e:
    print("모델 로딩 실패:", e)


def finish(board):
    n = 19
    board = np.array(board.copy)
    def can_place(x, y):
        if x < 0 or x >= n or y < 0 or y >= n:
            return False
        return board[x][y] == 0

    for i in range(n):
        for j in range(n):
            cond1 = cond2 = cond3 = cond4 = False
            try:
                # 가로로 4개의 돌 확인
                if j + 3 < n and all(board[i, j:j+4] == 1):
                    if can_place(i, j + 4): return (i, j + 4)
                    if can_place(i, j - 1): return (i, j - 1)
            except:
                pass
            try:
                # 세로로 4개의 돌 확인
                if i + 3 < n and all(board[i:i+4, j] == 1):
                    if can_place(i + 4, j): return (i + 4, j)
                    if can_place(i - 1, j): return (i - 1, j)
            except:
                pass
            try:
                # 왼쪽 위에서 오른쪽 아래로 대각선 4개의 돌 확인
                if i + 3 < n and j + 3 < n and all([board[i+k, j+k] == 1 for k in range(4)]):
                    if can_place(i + 4, j + 4): return (i + 4, j + 4)
                    if can_place(i - 1, j - 1): return (i - 1, j - 1)
            except:
                pass
            try:
                # 왼쪽 아래에서 오른쪽 위로 대각선 4개의 돌 확인
                if i - 3 >= 0 and j + 3 < n and all([board[i-k, j+k] == 1 for k in range(4)]):
                    if can_place(i - 4, j + 4): return (i - 4, j + 4)
                    if can_place(i + 1, j - 1): return (i + 1, j - 1)
            except:
                pass
    return False


def get_cnn_move(board):
    tmp = finish(board) 

    if tmp:
        return tmp

    board = np.array(board)

    input_ = board.copy()

    input_[input_ == 2] = -1

    input_ = np.expand_dims(input_, axis=(0, -1)).astype(np.float32)

    output = model.predict(input_, verbose=0).squeeze()
    
    output = output.reshape((19, 19))
    
    output_y, output_x = np.unravel_index(np.argmax(output), output.shape)
    
    return (int(output_y), int(output_x))

