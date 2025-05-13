import numpy as np
from tensorflow.keras.models import load_model
import tensorflow as tf

try:
    model = load_model('/home/jinjinjara1022/OmokAI/models/best.h5')
    print("모델 로드 성공")
except Exception as e:
    print("모델 로딩 실패:", e)

def get_cnn_move(board):
    board = np.array(board)
    
    input_ = board.copy()

    input_[input_ == 2] = -1

    input_ = np.expand_dims(input_, axis=(0, -1)).astype(np.float32)

    output = model.predict(input_, verbose=0).squeeze()
    
    output = output.reshape((19, 19))
    
    output_y, output_x = np.unravel_index(np.argmax(output), output.shape)
    
    return (int(output_y), int(output_x))