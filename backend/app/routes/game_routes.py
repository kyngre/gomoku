from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Game, Move
from app.strategies import get_strategy
import random

game_bp = Blueprint("game", __name__)
BOARD_SIZE = 19

def empty_board():
    return [[0]*BOARD_SIZE for _ in range(BOARD_SIZE)]

@game_bp.route("/start-game", methods=["POST"])
def start_game():
    data = request.get_json()
    ai_strategy = data.get("ai_strategy", "easy")
    user_color = data.get("user_color")
    if user_color not in ("black","white"):
        user_color = random.choice(["black","white"])
    ai_color = "white" if user_color=="black" else "black"

    new_game = Game(ai_strategy=ai_strategy, starter=user_color)
    db.session.add(new_game); db.session.commit()

    first_ai_move = None
    if ai_color=="black":
        board = empty_board()
        ai_func = get_strategy(ai_strategy)
        pt = ai_func(board)
        if pt:
            r,c = pt
            move = Move(game_id=new_game.id, row=r, col=c, player="black")
            db.session.add(move); db.session.commit()
            first_ai_move = {"row":r, "col":c, "player":"black"}

    return jsonify({
        "game_id": new_game.id,
        "user_color": user_color,
        "ai_color": ai_color,
        "first_ai_move": first_ai_move
    })
