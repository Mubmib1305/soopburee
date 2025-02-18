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