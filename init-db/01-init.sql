-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products (200 records)
INSERT INTO products (name, price, category, stock) VALUES
-- Electronics
('iPhone 14 Pro', 15999000, 'Electronics', 50),
('Samsung Galaxy S23', 12999000, 'Electronics', 75),
('MacBook Pro M2', 25999000, 'Electronics', 30),
('Dell XPS 13', 18999000, 'Electronics', 40),
('iPad Air', 8999000, 'Electronics', 60),
('Apple Watch Series 8', 5999000, 'Electronics', 80),
('AirPods Pro', 3999000, 'Electronics', 100),
('Sony WH-1000XM4', 4999000, 'Electronics', 70),
('Logitech MX Master 3', 1299000, 'Electronics', 120),
('Mechanical Keyboard', 2499000, 'Electronics', 90),

-- Clothing
('Nike Air Force 1', 1599000, 'Clothing', 200),
('Adidas Ultraboost', 2799000, 'Clothing', 150),
('Levi''s 501 Jeans', 899000, 'Clothing', 300),
('Uniqlo Basic T-Shirt', 199000, 'Clothing', 500),
('H&M Hoodie', 399000, 'Clothing', 250),
('Zara Jacket', 1299000, 'Clothing', 100),
('Converse Chuck Taylor', 799000, 'Clothing', 180),
('Polo Ralph Lauren Shirt', 1899000, 'Clothing', 120),
('Tommy Hilfiger Sweater', 2199000, 'Clothing', 80),
('Calvin Klein Underwear', 299000, 'Clothing', 400),

-- Home & Garden
('IKEA Dining Table', 2999000, 'Home & Garden', 25),
('Office Chair Ergonomic', 1799000, 'Home & Garden', 60),
('Philips Air Purifier', 3499000, 'Home & Garden', 40),
('Dyson V15 Vacuum', 8999000, 'Home & Garden', 20),
('KitchenAid Stand Mixer', 6999000, 'Home & Garden', 15),
('Instant Pot Pressure Cooker', 1999000, 'Home & Garden', 50),
('Nespresso Coffee Machine', 2799000, 'Home & Garden', 35),
('Robot Vacuum Cleaner', 4999000, 'Home & Garden', 30),
('Smart TV 55 inch', 7999000, 'Home & Garden', 45),
('Soundbar Samsung', 2499000, 'Home & Garden', 55),

-- Books & Media
('The Psychology of Money', 199000, 'Books & Media', 100),
('Atomic Habits', 229000, 'Books & Media', 150),
('Sapiens', 299000, 'Books & Media', 80),
('The Lean Startup', 249000, 'Books & Media', 90),
('Clean Code', 399000, 'Books & Media', 70),
('Design Patterns', 499000, 'Books & Media', 60),
('JavaScript The Good Parts', 329000, 'Books & Media', 85),
('You Don''t Know JS', 279000, 'Books & Media', 95),
('Eloquent JavaScript', 359000, 'Books & Media', 75),
('Learning React', 429000, 'Books & Media', 65),

-- Sports & Outdoors
('Wilson Tennis Racket', 1899000, 'Sports & Outdoors', 40),
('Nike Football', 399000, 'Sports & Outdoors', 100),
('Yoga Mat Premium', 599000, 'Sports & Outdoors', 150),
('Dumbbells Set 20kg', 1299000, 'Sports & Outdoors', 50),
('Treadmill Home Use', 8999000, 'Sports & Outdoors', 10),
('Bicycle Mountain Bike', 4999000, 'Sports & Outdoors', 25),
('Swimming Goggles', 199000, 'Sports & Outdoors', 200),
('Basketball Spalding', 599000, 'Sports & Outdoors', 80),
('Golf Club Set', 12999000, 'Sports & Outdoors', 15),
('Camping Tent 4 Person', 2999000, 'Sports & Outdoors', 30),

-- Beauty & Health
('Skincare Set Korean', 899000, 'Beauty & Health', 120),
('Vitamin C Serum', 299000, 'Beauty & Health', 200),
('Sunscreen SPF 50', 199000, 'Beauty & Health', 300),
('Hair Dryer Dyson', 5999000, 'Beauty & Health', 25),
('Electric Toothbrush', 799000, 'Beauty & Health', 100),
('Massage Gun', 1999000, 'Beauty & Health', 60),
('Essential Oil Set', 599000, 'Beauty & Health', 150),
('Face Mask Sheet', 99000, 'Beauty & Health', 500),
('Protein Powder', 899000, 'Beauty & Health', 80),
('Multivitamin', 299000, 'Beauty & Health', 250);

-- Generate more products to reach 200
INSERT INTO products (name, price, category, stock)
SELECT 
    'Product ' || generate_series(51, 200),
    (random() * 10000000 + 100000)::DECIMAL(10,2),
    CASE (random() * 5)::INT
        WHEN 0 THEN 'Electronics'
        WHEN 1 THEN 'Clothing'
        WHEN 2 THEN 'Home & Garden'
        WHEN 3 THEN 'Books & Media'
        WHEN 4 THEN 'Sports & Outdoors'
        ELSE 'Beauty & Health'
    END,
    (random() * 500 + 10)::INT;

-- Insert sample users (100 records)
INSERT INTO users (username, email, last_login, login_count, status)
SELECT 
    'user' || generate_series(1, 100),
    'user' || generate_series(1, 100) || '@example.com',
    CURRENT_TIMESTAMP - (random() * interval '30 days'),
    (random() * 100)::INT + 1,
    CASE 
        WHEN random() > 0.1 THEN 'active'
        ELSE 'inactive'
    END;

-- Insert sample sales data (500 records)
INSERT INTO sales (product_id, quantity, sale_date)
SELECT 
    (random() * 200 + 1)::INT,
    (random() * 10 + 1)::INT,
    CURRENT_TIMESTAMP - (random() * interval '60 days')
FROM generate_series(1, 500);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);

-- Display summary
SELECT 
    'Products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
SELECT 
    'Users' as table_name,
    COUNT(*) as record_count
FROM users
UNION ALL
SELECT 
    'Sales' as table_name,
    COUNT(*) as record_count
FROM sales;
