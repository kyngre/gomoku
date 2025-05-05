from app.database import db
from datetime import datetime

class Move(db.Model): # 착수기록
    __tablename__ = 'moves'

    id = db.Column(db.Integer, primary_key=True)
    row = db.Column(db.Integer, nullable=False)
    col = db.Column(db.Integer, nullable=False)
    player = db.Column(db.String(10), nullable=False)  # 'black' or 'white'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Move {self.id}: {self.player} ({self.row}, {self.col})>"
