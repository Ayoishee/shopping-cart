CREATE DATABASE IF NOT EXISTS shopping_cart_db;
USE shopping_cart_db;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    stock INT DEFAULT 0,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Orders Table (for future use)
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Products
INSERT INTO products (name, description, price, category, stock, image) VALUES
('Laptop', 'High performance laptop for work and gaming', 999.99, 'electronics', 10, 'https://via.placeholder.com/300x200?text=Laptop'),
('Wireless Mouse', 'Comfortable and precise wireless mouse', 29.99, 'electronics', 50, 'https://via.placeholder.com/300x200?text=Mouse'),
('USB-C Cable', 'Durable USB-C charging cable', 15.99, 'electronics', 100, 'https://via.placeholder.com/300x200?text=USB-C'),
('T-Shirt', 'Comfortable cotton T-shirt', 19.99, 'fashion', 75, 'https://via.placeholder.com/300x200?text=T-Shirt'),
('Jeans', 'Blue denim jeans', 49.99, 'fashion', 40, 'https://via.placeholder.com/300x200?text=Jeans'),
('Programming Book', 'Learn Python Programming', 39.99, 'books', 30, 'https://via.placeholder.com/300x200?text=Python+Book');