class Config:
    SUPABASE_URL = "https://xgontdbhwyxxngymcuoz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnb250ZGJod3l4eG5neW1jdW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMTMwMzQsImV4cCI6MjA1NDY4OTAzNH0.qkADn9Bu-5jmaq_0c2f_em9E5m5AkK5FDty1IBAV2uY"
    DATABASE_URL = "postgresql://postgres:[Nov1223:50]@db.xekpchdzspzzjytcwokt.supabase.co:5432/postgres"

# ไฟล์นี้ใช้เก็บการตั้งค่าทั้งหมดของแอปพลิเคชัน
# ทำหน้าที่:
# 1. กำหนดค่า URL และ API Key สำหรับเชื่อมต่อกับ Supabase
# 2. กำหนดค่า URL สำหรับเชื่อมต่อกับฐานข้อมูล PostgreSQL โดยตรง (ถ้าจำเป็น)
# ค่าเหล่านี้จะถูกใช้โดย app/utils/db.py เพื่อสร้างการเชื่อมต่อกับ Supabase