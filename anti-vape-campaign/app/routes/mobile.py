from flask import Blueprint, render_template, request, jsonify, url_for, redirect, session
from app.utils.db import supabase

# สร้าง Blueprint สำหรับส่วน mobile
mobile_bp = Blueprint('mobile', __name__, static_folder='static')

# หน้าหลัก
@mobile_bp.route('/')
def index():
    return render_template('index.html')

# หน้า mobile view
@mobile_bp.route('/mobile')
def mobile_view():
    return render_template('mobile.html')

# หน้าลงทะเบียน
@mobile_bp.route('/page2')
def page2():
    return render_template('page2.html')

# หน้าแสดงชื่อผู้ใช้
@mobile_bp.route('/page3')
def page3():
    return render_template('page3.html', nickname=session.get('nickname', 'ผู้ใช้'))

# หน้าเลือกวิธีการดูแล
@mobile_bp.route('/page4')
def page4():
    return render_template('page4.html')

"""<<-------------------Case1------------------->>"""
@mobile_bp.route('/case1/page5_1_1')
def page5_1_1():
    # ดึงข้อมูลดอกไม้ที่ผู้ใช้เลือกจาก database
    result = supabase.from_('guardians').select('selected_flower').eq('id', session['user_id']).execute()
    selected_flower = result.data[0]['selected_flower'] if result.data else 1
    return render_template('case1/page5_1_1.html', selected_flower=selected_flower)

@mobile_bp.route('/case1/page5_1_2')
def page5_1_2():
    return render_template('case1/page5_1_2.html')

@mobile_bp.route('/case1/page5_1_3')
def page5_1_3():
    return render_template('case1/page5_1_3.html')

@mobile_bp.route('/case1/page5_1_4')
def page5_1_4():
    return render_template('case1/page5_1_4.html')

@mobile_bp.route('/case1/page5_1_5')
def page5_1_5():
    return render_template('case1/page5_1_5.html')

@mobile_bp.route('/case1/page5_1_6')
def page5_1_6():
    return render_template('case1/page5_1_6.html')

@mobile_bp.route('/case1/page5_1_7')
def page5_1_7():
    return render_template('case1/page5_1_7.html')

@mobile_bp.route('/case1/page5_1_8')
def page5_1_8():
    try:
        user_message = session.get('user_message', 'ข้อความของคุณ')
        # ดึงข้อมูลดอกไม้ที่ผู้ใช้เลือกจาก database
        result = supabase.from_('guardians').select('selected_flower').eq('id', session['user_id']).execute()
        selected_flower = result.data[0]['selected_flower'] if result.data else 1
        return render_template('case1/page5_1_8.html', 
                             user_message=user_message,
                             selected_flower=selected_flower)
    except Exception as e:
        print(f"Error: {str(e)}")
        return render_template('case1/page5_1_8.html', 
                             user_message='ข้อความของคุณ',
                             selected_flower=1)

@mobile_bp.route('/case1/page5_1_9')
def page5_1_9():
    return render_template('case1/page5_1_9.html')

@mobile_bp.route('/case1/page5_1_10')
def page5_1_10():
    return render_template('case1/page5_1_10.html')

@mobile_bp.route('/case1/page5_1_11')
def page5_1_11():
    return render_template('case1/page5_1_11.html')

"""<<------------------Case2------------------->>"""
@mobile_bp.route('/case2/page5_2_1')
def page5_2_1():
    result = supabase.from_('guardians').select('selected_flower').eq('id', session['user_id']).execute()
    selected_flower = result.data[0]['selected_flower'] if result.data else 1
    return render_template('case2/page5_2_1.html', selected_flower=selected_flower)

@mobile_bp.route('/case2/page5_2_2')
def page5_2_2():
    return render_template('case2/page5_2_2.html')

@mobile_bp.route('/case2/page5_2_3')
def page5_2_3():
    return render_template('case2/page5_2_3.html')

@mobile_bp.route('/case2/page5_2_4')
def page5_2_4():
    return render_template('case2/page5_2_4.html')

@mobile_bp.route('/case2/page5_2_5')
def page5_2_5():
    return render_template('case2/page5_2_5.html')

@mobile_bp.route('/case2/page5_2_6')
def page5_2_6():
    return render_template('case2/page5_2_6.html')

@mobile_bp.route('/case2/page5_2_7')
def page5_2_7():
    return render_template('case2/page5_2_7.html')

@mobile_bp.route('/case2/page5_2_8')
def page5_2_8():
    return render_template('case2/page5_2_8.html')

"""<<-------------------API Functions------------------->>"""
# API สำหรับสร้างข้อความ
@mobile_bp.route('/api/messages', methods=['POST'])
def create_message():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'กรุณากรอกข้อความ'}), 400

        result = supabase.from_('messages').insert({
            'content': message,
            'status': 'active'
        }).execute()
        
        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# API สำหรับลงทะเบียน
@mobile_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        nickname = data.get('nickname')
        birth_year = data.get('birth_year')
        
        if not nickname or not birth_year:
            return jsonify({'error': 'กรุณากรอกชื่อเล่นและปีเกิด'}), 400

        birth_year = int(birth_year)

        # เอา selected_message ออก
        result = supabase.from_('guardians').insert({
            'nickname': nickname,
            'birth_year': birth_year,
            'selected_flower': 0,
            'care_method': 0,
            'selected_quote': '',  # เก็บไว้สำหรับข้อความ
            'selected_emoji': '',  # เก็บไว้สำหรับอิโมจิ
            'user_message': ''
        }).execute()
        
        if result.data:
            session['user_id'] = result.data[0]['id']
            session['nickname'] = nickname
        
        return jsonify({'status': 'success', 'data': result.data})
    except ValueError:
        return jsonify({'error': 'ปีเกิดต้องเป็นตัวเลข'}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# API สำหรับเลือกดอกไม้
@mobile_bp.route('/api/select-flower', methods=['POST'])
def select_flower():
    try:
        data = request.json
        flower_id = data.get('flower_id')
        
        if not flower_id or flower_id not in [1, 2, 3]:
            return jsonify({'error': 'รหัสดอกไม้ไม่ถูกต้อง'}), 400

        result = supabase.from_('guardians').update({
            'selected_flower': flower_id
        }).eq('id', session['user_id']).execute()
        
        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# API สำหรับเลือกวิธีการดูแล
@mobile_bp.route('/api/select-care-method', methods=['POST'])
def select_care_method():
    try:
        data = request.json
        care_method = data.get('care_method')
        
        if not care_method or care_method not in [1, 2]:
            return jsonify({'error': 'วิธีการดูแลไม่ถูกต้อง'}), 400

        result = supabase.from_('guardians').update({
            'care_method': care_method
        }).eq('id', session['user_id']).execute()
        
        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# API สำหรับเลือกข้อความ
@mobile_bp.route('/api/select-message', methods=['POST'])
def select_message():
    try:
        data = request.json
        message_id = data.get('message_id')
        message_text = data.get('message_text')
        
        if not message_id or not message_text:
            return jsonify({'error': 'กรุณาเลือกข้อความ'}), 400

        result = supabase.from_('guardians').update({
            'selected_message': message_text
        }).eq('id', session['user_id']).execute()
        
        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# API สำหรับบันทึกข้อความ
@mobile_bp.route('/api/save-message', methods=['POST'])
def save_message():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'กรุณากรอกข้อความ'}), 400

        session['user_message'] = message

        result = supabase.from_('guardians').update({
            'user_message': message
        }).eq('id', session.get('user_id')).execute()
        
        return jsonify({'status': 'success', 'data': result.data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@mobile_bp.route('/api/select-quote', methods=['POST'])
def select_quote():
    try:
        data = request.json
        user_id = session.get('user_id')

        if not user_id:
            return jsonify({'error': 'กรุณาเข้าสู่ระบบใหม่'}), 401

        # ตรวจสอบข้อมูลที่จำเป็น
        selected_quote = data.get('selected_quote')
        selected_emoji = data.get('selected_emoji')
        quote_id = data.get('quote_id')
        quote_type = data.get('quote_type')

        if not all([selected_quote, selected_emoji, quote_id, quote_type]):
            return jsonify({'error': 'ข้อมูลไม่ครบถ้วน'}), 400

        # อัพเดทข้อมูลแยกคอลัมน์
        update_data = {
            'selected_quote': selected_quote,
            'selected_emoji': selected_emoji,
            'quote_id': quote_id,
            'quote_type': quote_type
        }

        result = supabase.from_('guardians').update(update_data).eq('id', user_id).execute()
        
        return jsonify({'status': 'success', 'data': result.data})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500