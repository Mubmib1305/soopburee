from supabase import create_client, Client
from app.config import Config
import os

# ใช้ try-except เพื่อจับ error ที่อาจเกิดขึ้น
try:
    supabase_url = os.getenv('SUPABASE_URL', Config.SUPABASE_URL)
    supabase_key = os.getenv('SUPABASE_KEY', Config.SUPABASE_KEY)
    
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    raise

# ไฟล์นี้ทำหน้าที่สร้างการเชื่อมต่อกับ Supabase
# โดยมีกระบวนการดังนี้:
# 1. อ่านค่า URL และ API Key จากตัวแปรสภาพแวดล้อม (environment variables) ถ้ามี
# 2. ถ้าไม่มีตัวแปรสภาพแวดล้อม จะใช้ค่าจาก Config แทน
# 3. สร้าง Supabase Client ด้วยค่าที่กำหนด ซึ่งจะถูกนำไปใช้ในโมดูลอื่นๆ
# 4. มีการจัดการข้อผิดพลาดเพื่อให้แสดงข้อความที่ชัดเจนหากไม่สามารถเชื่อมต่อได้