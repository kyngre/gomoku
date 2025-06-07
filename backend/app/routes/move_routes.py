# app/routes/move_routes.py 

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.database import db
from app.models import Game, Move
from app.strategies import get_strategy
from app.utils.check_win import check_win
from sqlalchemy import asc

move_bp = Blueprint("move", __name__)
BOARD_SIZE = 19

def get_board(game_id):
    board = [[0]*BOARD_SIZE for _ in range(BOARD_SIZE)]
    for mv in Move.query.filter_by(game_id=game_id).order_by(asc(Move.created_at)):
        board[mv.row][mv.col] = 1 if mv.player == "black" else 2
    return board

@move_bp.route("/move/<strategy>", methods=["POST", "OPTIONS"])
@cross_origin()
def move_with_strategy(strategy):
    if request.method == "OPTIONS":
        return jsonify({}), 200  # HEAD 버전의 CORS 처리 유지

    try:  # HEAD 버전의 에러 핸들링 추가
        print(f"=== Move API 호출 - 전략: {strategy} ===")
        
        # [공통 부분 합치기]
        data = request.get_json()
        game_id = data.get("game_id")
        row = data.get("row")
        col = data.get("col")
        player = data.get("player")

        if None in [game_id, row, col, player]:
            return jsonify({"error": "Missing required fields"}), 400

        game = Game.query.get(game_id)
        if not game:
            return jsonify({"error": "Game not found"}), 404

        board = get_board(game_id)
        # HEAD 버전의 전략 검증 추가
        ai_func = get_strategy(strategy)
        if ai_func is None:
            print(f"ERROR: AI 전략을 찾을 수 없음: {strategy}")
            return jsonify({"error": f"AI strategy '{strategy}' not found"}), 400

        # [원격 버전의 DB 커밋 구조 적용]
        mv_user = Move(game_id=game_id, row=row, col=col, player=player)
        db.session.add(mv_user)
        db.session.commit()  # 원격 버전의 커밋 시점 적용

        if check_win(board, row, col, player):
            game.winner = player  # HEAD 버전의 동적 winner 지정
            db.session.commit()
            return jsonify({
                "result": "user_win",
                "winner": player,  # 동적 플레이어 ID 사용
                "ai_move": None
            })

        board[row][col] = 1 if player == "black" else 2
        print("AI 수 계산 시작")  # HEAD 버전의 디버그 로그 유지
        pt = ai_func(board)
        print(f"AI 반환값: {pt}")

        if not pt:
            return jsonify({"error": "No valid move"}), 400

        ar, ac = pt
        ai_color = "white" if player == "black" else "black"
        mv_ai = Move(game_id=game_id, row=ar, col=ac, player=ai_color)
        db.session.add(mv_ai)
        db.session.commit()

        board[ar][ac] = 1 if ai_color == "black" else 2
        if check_win(board, ar, ac, ai_color):
            game.winner = ai_color  # HEAD 버전의 동적 winner 지정
            db.session.commit()
            return jsonify({
                "result": "ai_win",
                "winner": ai_color,  # 동적 AI 색상 사용
                "ai_move": {"row": ar, "col": ac, "player": ai_color}
            })

        return jsonify({
            "result": "continue",
            "ai_move": {"row": ar, "col": ac, "player": ai_color}
        })

    except Exception as e:  # HEAD 버전의 예외 처리 유지
        print(f"Move API 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
