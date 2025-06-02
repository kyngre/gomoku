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

# pymysql 드라이버 사용, UTF8MB4 문자셋 지정
MYSQL_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    "?charset=utf8mb4"
)
engine = create_engine(MYSQL_URL, echo=False, future=True)

# ──────────────────────────────────────────────────────────────────────────────
# 1) games 테이블 덤프 함수
# ──────────────────────────────────────────────────────────────────────────────
def fetch_games() -> pd.DataFrame:
    """
    games 테이블을 pandas DataFrame으로 반환.
    """
    sql = """
    SELECT
      `id`,
      `ai_strategy`,
      `starter`,
      `winner`,
      `created_at`
    FROM `games`
    """
    return pd.read_sql(sql, con=engine)

# ──────────────────────────────────────────────────────────────────────────────
# 2) moves 테이블 덤프 함수
# ──────────────────────────────────────────────────────────────────────────────
def fetch_moves(since_timestamp: str = None) -> pd.DataFrame:
    """
    moves 테이블에서 착수 기록을 불러와 pandas DataFrame으로 반환.
    since_timestamp: 'YYYY-MM-DD HH:MM:SS' 이후의 레코드만 조회
    """
    sql = """
    SELECT
      `id`,
      `game_id`,
      `row`,
      `col`,
      `player`,
      `created_at`
    FROM `moves`
    """
    if since_timestamp:
        sql += f" WHERE `created_at` > '{since_timestamp}'"
    return pd.read_sql(sql, con=engine)

# ──────────────────────────────────────────────────────────────────────────────
# 메인: CSV·NPY로 저장
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    # 저장용 디렉토리
    out_dir = 'raw'
    os.makedirs(out_dir, exist_ok=True)

    # 1) games 전체 덤프
    df_games = fetch_games()
    games_csv = os.path.join(out_dir, 'games.csv')
    df_games.to_csv(games_csv, index=False)
    np.save(games_csv.replace('.csv', '.npy'), df_games.to_records(index=False))
    print(f"→ Saved Games: {games_csv}, {games_csv.replace('.csv', '.npy')}")

    # 2) moves 덤프 (필요하면 since_timestamp 인자 조정)
    since = None  # 예: '2025-05-01 00:00:00'
    df_moves = fetch_moves(since_timestamp=since)
    moves_csv = os.path.join(out_dir, 'moves.csv')
    df_moves.to_csv(moves_csv, index=False)
    np.save(moves_csv.replace('.csv', '.npy'), df_moves.to_records(index=False))
    print(f"→ Saved Moves: {moves_csv}, {moves_csv.replace('.csv', '.npy')}")