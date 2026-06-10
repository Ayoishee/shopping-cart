const API_URL = 'http://localhost:5000/api';

// Product Detail Page
if (window.location.pathname.includes('product-detail')) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    async function loadProductDetail() {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            const product = await response.json();

            document.getElementById('productName').textContent = product.name;
            document.getElementById('productDescription').textContent = product.description;
            document.getElementById('productPrice').textContent = product.price;
            document.getElementById('productCategory').textContent = product.category;
            document.getElementById('productStock').textContent = product.stock;
            document.getElementById('productImage').src = product.image;

            document.getElementById('addToCartBtn').addEventListener('click', () => {
                addToCart(product);
            });
        } catch (error) {
            console.error('Error loading product:', error);
        }
    }

    window.addEventListener('load', () => {
        loadProductDetail();
        updateCartCount();
    });
}

function addToCart(product) {
    const quantity = parseInt(document.getElementById('quantity').value);

    if (quantity <= 0) {
        alert('Please select a valid quantity');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadges = document.querySelectorAll('#cartCount');
    cartBadges.forEach(badge => {
        badge.textContent = cartCount;
    });
}

// Cart Page
if (window.location.pathname.includes('cart.html')) {
    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartContent = document.getElementById('cartContent');

        if (cart.length === 0) {
            cartContent.innerHTML = '<div class="empty-cart">Your cart is empty. <a href="categories.html">Continue shopping</a></div>';
            document.getElementById('checkoutBtn').disabled = true;
            return;
        }

        cartContent.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price}</p>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                </div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            `;

            cartContent.appendChild(cartItem);
        });

        attachCartEventListeners();
        updateCartSummary();
    }

    function attachCartEventListeners() {
        // Update quantity
        document.querySelectorAll('.cart-item-quantity input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                const newQuantity = parseInt(e.target.value);

                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                cart[index].quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));

                displayCart();
            });
        });

        // Remove item
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));

                displayCart();
            });
        });
    }

    function updateCartSummary() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.10;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('tax').textContent = tax.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
    }

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        alert('Thank you for your purchase! This is a demo.');
        localStorage.removeItem('cart');
        window.location.href = 'categories.html';
    });

    window.addEventListener('load', () => {
        checkAuth();
        displayCart();
        updateCartCount();
    });
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}