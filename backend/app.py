from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import numpy as np
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///omok.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)

class BoardSnapshot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board_state = db.Column(db.Text)
    move_x = db.Column(db.Integer)
    move_y = db.Column(db.Integer)
    who = db.Column(db.String(10))

class Omok:
    def __init__(self, size=19):
        self.size = size
        self.board = np.zeros((size, size), dtype=int)

    def place(self, row, col, player_color):
        if self.board[row][col] != 0:
            return False
        self.board[row][col] = 1 if player_color == 'black' else 2
        return True

    def ai_move(self):
        empty = list(zip(*np.where(self.board == 0)))
        if not empty:
            return None
        row, col = empty[np.random.choice(len(empty))]
        self.board[row][col] = 2  # AI는 white
        return (int(row), int(col))

game = Omok()

@app.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    row, col = data['row'], data['col']
    player = data['player']  # "player1" 또는 "player2"

    if not game.place(row, col, player):
        return jsonify({'error': 'invalid move'}), 400

    snapshot = BoardSnapshot(
        board_state=json.dumps(game.board.tolist()),
        move_x=col,
        move_y=row,
        who=player  # DB에 "player1" 또는 "player2"로 저장
    )
    db.session.add(snapshot)
    db.session.commit()

    return jsonify({'status': 'ok'})


@app.route('/reset', methods=['POST'])
def reset():
    global game
    game = Omok()
    return jsonify({'status': 'reset'})

@app.route('/snapshots', methods=['GET'])
def snapshots():
    snapshots = BoardSnapshot.query.all()
    return jsonify([
        {
            'id': s.id,
            'who': s.who,
            'move': [s.move_y, s.move_x],
            'board': json.loads(s.board_state)
        }
        for s in snapshots
    ])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)