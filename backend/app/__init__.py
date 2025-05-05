from flask import Flask
from app.database import db
from app.routes import move_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app, origins="http://localhost:5173")

    db.init_app(app)

    app.register_blueprint(move_bp)  

    return app
