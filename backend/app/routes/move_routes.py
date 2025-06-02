from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Game, Move
from app.strategies import get_strategy
from app.utils.check_win import check_win
from sqlalchemy import asc

# Move 관련 라우트를 위한 블루프린트 생성
move_bp = Blueprint("move", __name__)
BOARD_SIZE = 19  # 오목 게임판 크기 (19x19)

# 게임 ID에 해당하는 현재 게임판 상태 생성 함수
def get_board(game_id):
    # 19x19 크기의 2차원 배열 초기화 (0: 빈 칸, 1: 흑돌, 2: 백돌)
    board = [[0]*BOARD_SIZE for _ in range(BOARD_SIZE)]
    
    # 데이터베이스에서 해당 게임의 모든 수를 생성 시간순으로 조회
    for mv in Move.query.filter_by(game_id=game_id).order_by(asc(Move.created_at)):
        board[mv.row][mv.col] = 1 if mv.player == "black" else 2
    return board

# AI 전략을 사용한 수 두기 엔드포인트
@move_bp.route("/move/<strategy>", methods=["POST"])
def move_with_strategy(strategy):
    # 1. 요청 데이터 파싱
    data = request.get_json()
    game_id = data.get("game_id")
    row = data.get("row")
    col = data.get("col")
    player = data.get("player")

    # 필수 필드 검증
    if None in [game_id, row, col, player]:
        return jsonify({"error": "Missing required fields"}), 400

    # 2. 게임 존재 여부 확인
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    # 3. 현재 게임판 상태 및 AI 전략 로드
    board = get_board(game_id)
    ai_func = get_strategy(strategy)

    # 4. 사용자 수 기록
    mv_user = Move(game_id=game_id, row=row, col=col, player=player)
    db.session.add(mv_user)
    db.session.commit()

    # 5. 사용자 승리 확인 → winner = 'player'
    if check_win(board, row, col, player):
        game.winner = 'player'
        db.session.commit()
        return jsonify({
            "result": "user_win",
            "winner": "player",
            "ai_move": None
        })

    # 6. AI 수 계산
    board[row][col] = 1 if player == "black" else 2
    pt = ai_func(board)
    if not pt:
        return jsonify({"error": "No valid move"}), 400

    # 7. AI 수 기록
    ar, ac = pt
    ai_color = "white" if player == "black" else "black"
    mv_ai = Move(game_id=game_id, row=ar, col=ac, player=ai_color)
    db.session.add(mv_ai)
    db.session.commit()

    # 8. AI 승리 확인 → winner = 'ai'
    board[ar][ac] = 1 if ai_color == "black" else 2
    if check_win(board, ar, ac, ai_color):
        game.winner = 'ai'
        db.session.commit()
        return jsonify({
            "result": "ai_win",
            "winner": "ai",
            "ai_move": {"row": ar, "col": ac, "player": ai_color}
        })

    # 9. 게임 계속 진행
    return jsonify({
        "result": "continue",
        "ai_move": {"row": ar, "col": ac, "player": ai_color}
    })