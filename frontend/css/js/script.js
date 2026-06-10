const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Check health
async function checkHealth() {
    try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        console.log('Health check:', data);
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Login
document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            console.log('Logged in successfully!');
            showProducts();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

// Fetch products
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('products-list');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Add to cart
async function addToCart(productId) {
    try {
        const response = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        const data = await response.json();
        alert('Added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Show products section
function showProducts() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('products-section').classList.remove('hidden');
    fetchProducts();
}

// Initialize
checkHealth();