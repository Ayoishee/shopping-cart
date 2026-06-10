const API_URL = 'http://localhost:5000/api';

let allProducts = [];
let currentCategory = 'all';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Fetch products
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 50)}...</p>
                <p class="product-price">$${product.price}</p>
            </div>
        `;
        productCard.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        productsGrid.appendChild(productCard);
    });
}

// Filter products
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.dataset.category;
        if (currentCategory === 'all') {
            displayProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === currentCategory);
            displayProducts(filtered);
        }
    });
});

// Initialize
window.addEventListener('load', () => {
    checkAuth();
    fetchProducts();
    updateCartCount();
});

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}