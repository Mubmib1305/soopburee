from flask import Flask
from flask_cors import CORS
from app.config import Config
import secrets 

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    
    app.secret_key = secrets.token_hex(32)
    
    from app.routes.mobile import mobile_bp
    from app.routes.display import display_bp
    
    app.register_blueprint(mobile_bp)
    app.register_blueprint(display_bp)
    
    return app