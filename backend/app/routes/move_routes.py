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
        return jsonify({}), 200
    
    try:
        print(f"=== Move API 호출 - 전략: {strategy} ===")
        
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

        # 3. 현재 게임판 상태 로드
        board = get_board(game_id)
        
        # 4. AI 전략 로드 및 검증 추가
        print(f"AI 전략 로딩 시도: {strategy}")
        ai_func = get_strategy(strategy)
        
        if ai_func is None:  # 핵심 수정: None 체크 추가
            print(f"ERROR: AI 전략을 찾을 수 없음: {strategy}")
            return jsonify({"error": f"AI strategy '{strategy}' not found"}), 400
        
        print(f"AI 전략 로딩 성공: {ai_func}")

        # 5. 사용자 수 기록
        mv_user = Move(game_id=game_id, row=row, col=col, player=player)
        db.session.add(mv_user)
        db.session.commit()

        # 6. 사용자 승리 확인
        if check_win(board, row, col, player):
            game.winner = player
            db.session.commit()
            return jsonify({
                "result": "user_win",
                "winner": player,
                "ai_move": None
            })

        # 7. AI 수 계산
        board[row][col] = 1 if player == "black" else 2
        print("AI 수 계산 시작")
        pt = ai_func(board)  # 이제 안전하게 호출 가능
        print(f"AI 반환값: {pt}")
        
        if not pt:
            return jsonify({"error": "No valid move"}), 400

        # 8. AI 수 기록
        ar, ac = pt
        ai_color = "white" if player == "black" else "black"
        mv_ai = Move(game_id=game_id, row=ar, col=ac, player=ai_color)
        db.session.add(mv_ai)
        db.session.commit()

        # 9. AI 승리 확인
        board[ar][ac] = 1 if ai_color == "black" else 2
        if check_win(board, ar, ac, ai_color):
            game.winner = ai_color
            db.session.commit()
            return jsonify({
                "result": "ai_win",
                "winner": ai_color,
                "ai_move": {"row": ar, "col": ac, "player": ai_color}
            })

        # 10. 게임 계속 진행
        return jsonify({
            "result": "continue",
            "ai_move": {"row": ar, "col": ac, "player": ai_color}
        })

    except Exception as e:
        print(f"Move API 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
