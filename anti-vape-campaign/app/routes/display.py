from flask import Blueprint, render_template, jsonify
from app.utils.db import supabase
from datetime import datetime

display_bp = Blueprint('display', __name__)

@display_bp.route('/qrcode')
def qrcode_view():
    return render_template('qrcode.html')

@display_bp.route('/anatomy')
def anatomy_view():
    return render_template('anatomy.html')

@display_bp.route('/messages')
def messages_view():
    return render_template('messages.html')

@display_bp.route('/emoji')
def emoji_view():
    return render_template('emoji.html')

@display_bp.route('/api/messages/active')
def get_active_messages():
    try:
        # Debug: พิมพ์ข้อความก่อนดึงข้อมูล
        print("Fetching data from Supabase...")
        
        result = supabase.table('guardians').select('selected_quote, selected_emoji, quote_type, nickname, selected_flower').execute()
        
        # Debug: พิมพ์ผลลัพธ์ที่ได้จาก Supabase
        print("Supabase result:", result.data)
        
        messages = []
        emojis = []
        
        for item in result.data:
            if item.get('selected_quote') and item.get('quote_type') == 'message':
                messages.append({
                    'content': item['selected_quote'],
                    'type': 'message',
                    'sender': item.get('nickname', 'ผู้ไม่ประสงค์ออกนาม')
                })

            flower_id = item.get('selected_flower')
            if flower_id:
                flower_emoji = ""
                if flower_id == 1:
                    flower_emoji = "🌸"
                elif flower_id == 2:
                    flower_emoji = "🌺"
                elif flower_id == 3:
                    flower_emoji = "🌷"
                else:
                    flower_emoji = "🌹"

                emojis.append({
                    'content': flower_emoji,
                    'type': 'flower',
                    'flower_id': flower_id,
                    'timestamp': item.get('created_at', str(datetime.now()))
                })
        
        response_data = {
            'messages': messages,
            'emojis': emojis
        }
        
        print("Sending response:", response_data)
        
        return jsonify(response_data)
        
    except Exception as e:
        # Debug: พิมพ์ error ถ้าเกิดขึ้น
        print("Error in get_active_messages:", str(e))
        return jsonify({
            'error': str(e),
            'messages': [],
            'emojis': []
        }), 500