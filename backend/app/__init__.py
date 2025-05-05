from flask import Flask
from app.database import db

from app.routes.game_routes import game_bp
from app.routes.move_routes import move_bp

from flask_cors import CORS
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app)

    db.init_app(app)
    
    app.register_blueprint(game_bp)
    app.register_blueprint(move_bp)  

    migrate = Migrate(app, db)

    return app
