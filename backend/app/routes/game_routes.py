from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Game, Move
from app.strategies import get_strategy

# 게임 관련 라우팅을 위한 블루프린트 생성
game_bp = Blueprint("game", __name__)
BOARD_SIZE = 19  # 표준 오목 게임판 크기

# 빈 게임판 생성 함수
def empty_board():
    '''19x19 크기의 2차원 배열 초기화 (0: 빈 칸)'''
    return [[0]*BOARD_SIZE for _ in range(BOARD_SIZE)]

# 게임 시작 API 엔드포인트
@game_bp.route("/start-game", methods=["POST"])
def start_game():
    # 1. 요청 데이터 처리
    data = request.get_json()
    ai_strategy = data.get("ai_strategy", "easy")  # 기본 AI 난이도 설정
    user_color = data.get("user_color")  # 사용자 돌 색상
    
    ai_color = "white" if user_color=="black" else "black"  # AI 색상 자동 결정

    # 3. 새 게임 객체 생성 및 DB 저장
    new_game = Game(ai_strategy=ai_strategy, starter=user_color)
    db.session.add(new_game)
    db.session.commit()

    # 4. AI 선공 처리 (흑돌인 경우)
    first_ai_move = None
    if ai_color == "black":
        board = empty_board()
        ai_func = get_strategy(ai_strategy)  # 전략 패턴 적용
        pt = ai_func(board)  # AI 알고리즘으로 좌표 계산
        
        if pt:  # 유효한 수가 반환된 경우
            r,c = pt
            move = Move(game_id=new_game.id, row=r, col=c, player="black")
            db.session.add(move)
            db.session.commit()
            first_ai_move = {"row":r, "col":c, "player":"black"}

    # 5. 클라이언트 응답 구성
    return jsonify({
        "game_id": new_game.id,  # 게임 고유 식별자
        "user_color": user_color,  # 사용자 색상 정보
        "ai_color": ai_color,  # AI 색상 정보
        "first_ai_move": first_ai_move  # AI 선공 시 첫 수 좌표
    })
