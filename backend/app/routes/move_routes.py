from flask import Blueprint, request, jsonify
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
        board[mv.row][mv.col] = 1 if mv.player=="black" else 2
    return board

@move_bp.route("/move/<strategy>", methods=["POST"])
def move_with_strategy(strategy):
    data    = request.get_json()
    game_id = data.get("game_id")
    row     = data.get("row")
    col     = data.get("col")
    player  = data.get("player")

    if None in [game_id, row, col, player]:
        return jsonify({"error":"Missing required fields"}),400

    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error":"Game not found"}),404

    board   = get_board(game_id)
    ai_func = get_strategy(strategy)

    mv_user = Move(game_id=game_id, row=row, col=col, player=player)
    db.session.add(mv_user); db.session.commit()

    if check_win(board, row, col, player):
        game.winner = player; db.session.commit()
        return jsonify({"result":"user_win","winner":player,"ai_move":None})

    board[row][col] = 1 if player=="black" else 2
    pt = ai_func(board)
    if not pt:
        return jsonify({"error":"No valid move"}),400

    ar,ac = pt
    ai_color = "white" if player=="black" else "black"
    mv_ai = Move(game_id=game_id, row=ar, col=ac, player=ai_color)
    db.session.add(mv_ai); db.session.commit()

    board[ar][ac] = 1 if ai_color=="black" else 2
    if check_win(board, ar, ac, ai_color):
        game.winner = ai_color; db.session.commit()
        return jsonify({"result":"ai_win","winner":ai_color,"ai_move":{"row":ar,"col":ac,"player":ai_color}})

    return jsonify({"result":"continue","ai_move":{"row":ar,"col":ac,"player":ai_color}})
