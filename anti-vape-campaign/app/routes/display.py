from flask import Blueprint, render_template, jsonify
from app.utils.db import supabase

display_bp = Blueprint('display', __name__)

@display_bp.route('/display')
def display_view():
    return render_template('display.html')

@display_bp.route('/board_page')
def board_page():
    return render_template('board_page.html')

@display_bp.route('/api/messages/active')
def get_active_messages():
    result = supabase.table('guardians').select('selected_quote').execute()
    quotes = [{'content': item['selected_quote']} for item in result.data if item['selected_quote']]
    return jsonify({'messages': quotes})