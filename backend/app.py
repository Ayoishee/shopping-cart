from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

from routes.auth import auth_bp
from routes.products import products_bp
from routes.cart import cart_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(cart_bp, url_prefix='/api/cart')

FRONTEND = os.path.join(os.path.dirname(__file__), '../frontend')

@app.route('/')
@app.route('/<path:filename>')
def serve_frontend(filename='index.html'):
    return send_from_directory(FRONTEND, filename)

@app.route('/api/health')
def health():
    return {"status": "ok"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
