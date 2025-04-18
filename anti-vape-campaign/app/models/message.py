from datetime import datetime
from app.utils import supabase

class Message:
    def __init__(self, content, status='active', created_at=None, id=None):
        self.id = id
        self.content = content
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def create(content):
        data = {
            'content': content,
            'status': 'active',
            'created_at': datetime.utcnow().isoformat()
        }
        result = supabase.table('messages').insert(data).execute()
        return Message(**result.data[0]) if result.data else None

    @staticmethod
    def get_active():
        result = supabase.table('messages').select('*').eq('status', 'active').execute()
        return [Message(**msg) for msg in result.data] if result.data else []

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'status': self.status,
            'created_at': self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

# ไฟล์นี้เป็นโมเดลสำหรับข้อความ (Message) ในระบบ
# ทำหน้าที่:
# 1. กำหนดโครงสร้างข้อมูลของ Message ด้วย class
# 2. มีเมธอด create สำหรับสร้างข้อความใหม่ในฐานข้อมูล Supabase
# 3. มีเมธอด get_active สำหรับดึงข้อความที่มีสถานะ active ทั้งหมด
# 4. มีเมธอด to_dict สำหรับแปลงข้อมูล Message เป็นรูปแบบ dictionary 
#    เพื่อให้ง่ายต่อการส่งเป็น JSON response