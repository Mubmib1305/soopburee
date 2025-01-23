from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    
    from app.routes.mobile import mobile_bp
    from app.routes.display import display_bp
    
    app.register_blueprint(mobile_bp)
    app.register_blueprint(display_bp)
    
    return app