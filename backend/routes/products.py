from flask import Blueprint, request, jsonify
from models import get_db

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    category = request.args.get('category')
    db = get_db()
    try:
        with db.cursor() as cur:
            if category:
                cur.execute('SELECT * FROM products WHERE category=%s', (category,))
            else:
                cur.execute('SELECT * FROM products')
            return jsonify(cur.fetchall())
    finally:
        db.close()

@products_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute('SELECT * FROM products WHERE id=%s', (id,))
            p = cur.fetchone()
            return jsonify(p) if p else (jsonify({'error': 'Not found'}), 404)
    finally:
        db.close()
