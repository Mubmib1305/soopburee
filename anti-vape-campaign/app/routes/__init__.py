from flask import Blueprint

mobile_bp = Blueprint('mobile', __name__)
display_bp = Blueprint('display', __name__)

from .mobile import *
from .display import *

# ไฟล์นี้ใช้สำหรับกำหนด Blueprint หลักของแอปพลิเคชัน
# ทำหน้าที่:
# 1. สร้าง Blueprint สองตัวหลัก:
#    - mobile_bp: สำหรับจัดการเส้นทาง (routes) ที่เกี่ยวข้องกับส่วนแสดงผลบนมือถือ
#    - display_bp: สำหรับจัดการเส้นทางที่เกี่ยวข้องกับส่วนแสดงผลบนหน้าจอขนาดใหญ่
# 2. นำเข้าเส้นทางทั้งหมดจากไฟล์ mobile.py และ display.py
#    เพื่อให้สามารถใช้ Blueprint ที่สร้างได้อย่างสมบูรณ์