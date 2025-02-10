from flask import Blueprint, render_template, jsonify
from app.utils.db import supabase

display_bp = Blueprint('display', __name__)

@display_bp.route('/qrcode')
def qrcode_view():
    return render_template('qrcode.html')

@display_bp.route('/display')
def display_view():
    return render_template('display.html')

@display_bp.route('/board_page')
def board_page():
    return render_template('board_page.html')

@display_bp.route('/api/messages/active')
def get_active_messages():
    result = supabase.table('guardians').select('selected_quote, selected_emoji, quote_type').execute()
    
    messages = []
    emojis = []
    
    for item in result.data:
        # แยกข้อความ
        if item.get('selected_quote') and item.get('quote_type') == 'message':
            messages.append({
                'content': item['selected_quote'],
                'type': 'message'
            })
        # แยกอิโมจิ
        if item.get('selected_emoji'):
            emojis.append({
                'content': item['selected_emoji'],
                'type': 'emoji'
            })
    
    return jsonify({
        'messages': messages,
        'emojis': emojis
    })