from flask import Flask
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

# ไฟล์นี้เป็นจุดเริ่มต้นของแอปพลิเคชัน
# ทำหน้าที่ในการสร้างและรันแอป Flask ที่ port 10000
# เมื่อรันไฟล์นี้ด้วย python run.py จะทำให้แอปพลิเคชันทำงาน
# และสามารถเข้าถึงได้จากทุก IP ที่เชื่อมต่อกับเครื่องเซิร์ฟเวอร์