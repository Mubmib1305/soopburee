from flask import Blueprint, render_template, jsonify
from app.utils.db import supabase

display_bp = Blueprint('display', __name__)

@display_bp.route('/display')
def display_view():
    return render_template('display.html')

@display_bp.route('/api/messages/active')
def get_active_messages():
    result = supabase.table('messages').select('*').eq('status', 'active').execute()
    messages = result.data
    return jsonify({'messages': messages})