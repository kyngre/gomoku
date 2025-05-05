from flask import Blueprint, request, jsonify
from app.models import Move
from app.database import db

move_bp = Blueprint('move', __name__)

@move_bp.route('/move', methods=['POST'])
def post_move():
    data = request.get_json()
    
    row = data.get("row")
    col = data.get("col")
    player = data.get("player")

    if None in [row, col, player]:
        return jsonify({"error": "Missing fields"}), 400

    move = Move(row=row, col=col, player=player)
    db.session.add(move)
    db.session.commit()

    return jsonify({
        "ok": True,
        "msg": "Move saved",
        # 필요 시 AI 응답 등 추가
    })
