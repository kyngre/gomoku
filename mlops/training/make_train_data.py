import os
import numpy as np
import pandas as pd

# 1. CSV 파일 경로 설정
games_csv = '../data/raw/games_player_wins.csv'
moves_csv = '../data/raw/moves_player_wins.csv'

# 2. 데이터 로드
games = pd.read_csv(games_csv, parse_dates=['created_at'])
moves = pd.read_csv(moves_csv, parse_dates=['created_at'])


train_data = {'input': [], 'label': []}

for game_id, game_df in moves.groupby('game_id'):
    player_color = game_df['player'].iloc[-1]

    board = np.zeros((19, 19), dtype=int)
    
    for idx, data in game_df.iterrows():
        r, c, player = data['row'], data['col'], data['player']

        if player == player_color:
            _input = board.copy()
            output = np.zeros([19, 19], dtype=np.int8)
            output[r, c] = 1
            train_data['input'].append(_input)
            train_data['label'].append(output)

            board[r, c] = 1
        
        else:
            board[r, c] = -1

# 1) 배열로 변환
X = np.stack(train_data['input'], axis=0)    # shape: (N, 19, 19)
y = np.stack(train_data['label'], axis=0)    # shape: (N, 19, 19)

# (원한다면) 레이블 flatten
# y = y.reshape(y.shape[0], -1)  # shape: (N, 361)

# 2) 저장 디렉토리 준비
out_dir = './train_data'
os.makedirs(out_dir, exist_ok=True)

# 3) .npy 포맷으로 저장
np.save(os.path.join(out_dir, 'X_player.npy'), X)
np.save(os.path.join(out_dir, 'y_player.npy'), y)

# 4) 압축된 .npz 포맷으로 저장 (옵션)
np.savez_compressed(
    os.path.join(out_dir, 'train_data_player_win.npz'),
    X=X,
    y=y
)

print(f"Saved X to {out_dir}/X_player.npy (shape: {X.shape})")
print(f"Saved y to {out_dir}/y_player.npy (shape: {y.shape})")
print(f"Optionally saved compressed file at {out_dir}/train_data_player_win.npz")