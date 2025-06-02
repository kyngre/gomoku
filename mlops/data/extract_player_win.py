# mlops/data/load_db.py

import os
import numpy as np
import pandas as pd
from sqlalchemy import create_engine

# ──────────────────────────────────────────────────────────────────────────────
# MySQL 연결 정보 (환경변수 또는 기본값)
# ──────────────────────────────────────────────────────────────────────────────
DB_USER = os.getenv('DB_USER', 'admin')
DB_PASS = os.getenv('DB_PASS', 'admin')
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'gomoku')

MYSQL_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    "?charset=utf8mb4"
)
engine = create_engine(MYSQL_URL, echo=False, future=True)

# ──────────────────────────────────────────────────────────────────────────────
# 1) player가 이긴 게임만 덤프 함수
# ──────────────────────────────────────────────────────────────────────────────
def fetch_player_games() -> pd.DataFrame:
    """
    winner 컬럼이 'player'인 games 테이블 레코드만 반환.
    """
    sql = """
    SELECT
      `id`,
      `ai_strategy`,
      `starter`,
      `winner`,
      `created_at`
    FROM `games`
    WHERE `winner` = 'player'
    """
    return pd.read_sql(sql, con=engine)

# ──────────────────────────────────────────────────────────────────────────────
# 2) 해당 게임들의 moves만 덤프 함수
# ──────────────────────────────────────────────────────────────────────────────
def fetch_moves_for_games(game_ids: list, since_timestamp: str = None) -> pd.DataFrame:
    """
    주어진 game_ids 리스트에 속한 moves 레코드만 반환.
    since_timestamp: 'YYYY-MM-DD HH:MM:SS' 이후의 레코드만 조회
    """
    if not game_ids:
        return pd.DataFrame(columns=['id','game_id','row','col','player','created_at'])
    ids_str = ", ".join(map(str, game_ids))
    sql = f"""
    SELECT
      `id`,
      `game_id`,
      `row`,
      `col`,
      `player`,
      `created_at`
    FROM `moves`
    WHERE `game_id` IN ({ids_str})
    """
    if since_timestamp:
        sql += f" AND `created_at` > '{since_timestamp}'"
    return pd.read_sql(sql, con=engine)

# ──────────────────────────────────────────────────────────────────────────────
# 메인: CSV·NPY로 저장 (player 승리한 게임 데이터만)
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    out_dir = 'raw'
    os.makedirs(out_dir, exist_ok=True)

    # 1) player 승리 게임 덤프
    df_games = fetch_player_games()
    games_csv = os.path.join(out_dir, 'games_player_wins.csv')
    df_games.to_csv(games_csv, index=False)
    np.save(games_csv.replace('.csv', '.npy'),
            df_games.to_records(index=False))
    print(f"→ Saved player-win Games: {games_csv}, {games_csv.replace('.csv', '.npy')}")

    # 2) 해당 게임들의 moves 덤프
    player_game_ids = df_games['id'].tolist()
    since = None  # 필요 시 'YYYY-MM-DD HH:MM:SS'로 설정
    df_moves = fetch_moves_for_games(player_game_ids, since_timestamp=since)
    moves_csv = os.path.join(out_dir, 'moves_player_wins.csv')
    df_moves.to_csv(moves_csv, index=False)
    np.save(moves_csv.replace('.csv', '.npy'),
            df_moves.to_records(index=False))
    print(f"→ Saved player-win Moves: {moves_csv}, {moves_csv.replace('.csv', '.npy')}")
