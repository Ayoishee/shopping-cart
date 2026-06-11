from flask import Blueprint, request, jsonify
from models import get_db
from middleware import token_required

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart():
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute('''SELECT c.id, c.quantity, p.name, p.price, p.image
                          FROM cart c JOIN products p ON c.product_id=p.id
                          WHERE c.user_id=%s''', (request.user_id,))
            items = cur.fetchall()
            total = sum(float(i['price']) * i['quantity'] for i in items)
            return jsonify({'items': items, 'total': round(total, 2)})
    finally:
        db.close()

@cart_bp.route('/add', methods=['POST'])
@token_required
def add_to_cart():
    data = request.json
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute('''INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)
                          ON DUPLICATE KEY UPDATE quantity=quantity+%s''',
                       (request.user_id, data['product_id'], data.get('quantity',1), data.get('quantity',1)))
            db.commit()
        return jsonify({'message': 'Added to cart'})
    finally:
        db.close()

@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
@token_required
def remove_from_cart(item_id):
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute('DELETE FROM cart WHERE id=%s AND user_id=%s', (item_id, request.user_id))
            db.commit()
        return jsonify({'message': 'Removed'})
    finally:
        db.close()
