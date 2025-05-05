# app/models.py

from app.database import db
from datetime import datetime

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    ai_strategy = db.Column(db.String(50), nullable=False)           # ex. 'random', 'rulebased'
    starter = db.Column(db.String(10), nullable=False)               # 'black' or 'white'
    winner = db.Column(db.String(10), nullable=True)                 # 'black', 'white', or None
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 관계 설정: Game 1 ──── N Move
    moves = db.relationship("Move", backref="game", cascade="all, delete", lazy=True)

    def __repr__(self):
        return f"<Game {self.id} vs AI: {self.ai_strategy}>"

class Move(db.Model):
    __tablename__ = 'moves'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    row = db.Column(db.Integer, nullable=False)
    col = db.Column(db.Integer, nullable=False)
    player = db.Column(db.String(10), nullable=False)               # 'black' or 'white'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Move G{self.game_id} {self.player} ({self.row}, {self.col})>"
