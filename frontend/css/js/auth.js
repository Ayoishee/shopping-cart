const API_URL = 'http://localhost:5000/api';

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showMessage(data.message || 'Registration failed!', 'error');
            }
        } catch (error) {
            showMessage('Error: ' + error.message, 'error');
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'categories.html';
                }, 1500);
            } else {
                showMessage(data.message || 'Login failed!', 'error');
            }
        } catch (error) {
            showMessage('Error: ' + error.message, 'error');
        }
    });
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Display user email
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmailSpan = document.getElementById('userEmail');
    if (user && userEmailSpan) {
        userEmailSpan.textContent = user.email;
    }
});