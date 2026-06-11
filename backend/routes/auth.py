from flask import Blueprint, request, jsonify
import bcrypt, jwt, datetime
from models import get_db
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name, email, password = data.get('name'), data.get('email'), data.get('password')
    if not all([name, email, password]):
        return jsonify({'error': 'All fields required'}), 400
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute('INSERT INTO users (name, email, password) VALUES (%s, %s, %s)', (name, email, hashed))
            db.commit()
        return jsonify({'message': 'Registered successfully'}), 201
    except:
        return jsonify({'error': 'Email already exists'}), 400
    finally:
        db.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email, password = data.get('email'), data.get('password')
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute('SELECT * FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
        if not user or not bcrypt.checkpw(password.encode(), user['password'].encode()):
            return jsonify({'error': 'Invalid credentials'}), 401
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, Config.SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token, 'name': user['name']})
    finally:
        db.close()
