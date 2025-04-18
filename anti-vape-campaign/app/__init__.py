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

# ไฟล์นี้เป็นส่วนสำคัญในการสร้างแอปพลิเคชัน Flask
# ทำหน้าที่:
# 1. สร้างแอป Flask และเปิดใช้งาน CORS เพื่อให้สามารถเรียก API จากโดเมนอื่นได้
# 2. โหลดการตั้งค่าแอปจาก Config
# 3. สร้าง secret key สำหรับการใช้งาน session
# 4. ลงทะเบียน Blueprints สองส่วนหลักคือ:
#    - mobile_bp: สำหรับส่วนการแสดงผลบนอุปกรณ์มือถือ
#    - display_bp: สำหรับส่วนการแสดงผลบนหน้าจอขนาดใหญ่