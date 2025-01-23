from flask import Blueprint, render_template, request, jsonify
from app.utils.db import supabase

mobile_bp = Blueprint('mobile', __name__)

@mobile_bp.route('/')
@mobile_bp.route('/mobile')
def mobile_view():
    return render_template('mobile.html')

@mobile_bp.route('/api/messages', methods=['POST'])
def create_message():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        result = supabase.from_('messages').insert({
            'content': message,
            'status': 'active'
        }).execute()
        
        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500