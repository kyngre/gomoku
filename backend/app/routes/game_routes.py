# app/routes/game_routes.py 수정

from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Game, Move
from app.strategies import get_strategy

game_bp = Blueprint("game", __name__)
BOARD_SIZE = 19

def empty_board():
    return [[0]*BOARD_SIZE for _ in range(BOARD_SIZE)]

@game_bp.route("/start-game", methods=["POST"])
def start_game():
    try:
        print("=== 게임 시작 API 호출 ===")
        
        # 1. 요청 데이터 처리
        data = request.get_json()
        ai_strategy = data.get("ai_strategy", "easy")
        user_color = data.get("user_color")
        
        print(f"AI 전략: {ai_strategy}, 사용자 색상: {user_color}")
        
        ai_color = "white" if user_color == "black" else "black"

        # 2. AI 전략 검증 추가
        ai_func = get_strategy(ai_strategy)
        if ai_func is None:
            print(f"ERROR: AI 전략을 찾을 수 없음: {ai_strategy}")
            return jsonify({"error": f"AI strategy '{ai_strategy}' not found"}), 400

        print(f"AI 전략 로딩 성공: {ai_func}")

        # 3. 새 게임 객체 생성 및 DB 저장
        new_game = Game(ai_strategy=ai_strategy, starter=user_color)
        db.session.add(new_game)
        db.session.commit()

        # 4. AI 선공 처리 (흑돌인 경우)
        first_ai_move = None
        if ai_color == "black":
            board = empty_board()
            pt = ai_func(board)  # 이제 안전하게 호출 가능
            
            if pt:
                r, c = pt
                move = Move(game_id=new_game.id, row=r, col=c, player="black")
                db.session.add(move)
                db.session.commit()
                first_ai_move = {"row": r, "col": c, "player": "black"}

        # 5. 클라이언트 응답 구성
        return jsonify({
            "game_id": new_game.id,
            "user_color": user_color,
            "ai_color": ai_color,
            "first_ai_move": first_ai_move
        })

    except Exception as e:
        print(f"게임 시작 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to start game: {str(e)}"}), 500
