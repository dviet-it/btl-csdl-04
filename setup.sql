-- ============================================
-- Fashion Store Database Setup Script
-- Run this in MySQL before starting the app
-- ============================================

CREATE DATABASE IF NOT EXISTS fashion_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fashion_store;

-- Categories
CREATE TABLE IF NOT EXISTS category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS product (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variant (
  variant_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  size VARCHAR(50),
  color VARCHAR(50),
  price DECIMAL(15,2) NOT NULL,
  cost_price DECIMAL(15,2),
  stock_quantity INT DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Staff (must be before import_orders which refs it)
CREATE TABLE IF NOT EXISTS staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  staff_name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  phone VARCHAR(20),
  hire_date DATE,
  status VARCHAR(50)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255)
);

-- Import Orders
CREATE TABLE IF NOT EXISTS import_orders (
  import_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  staff_id INT,
  import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_cost DECIMAL(15,2),
  status VARCHAR(50),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- Import Order Details
CREATE TABLE IF NOT EXISTS import_order_details (
  import_id INT NOT NULL,
  variant_id INT NOT NULL,
  quantity INT NOT NULL,
  cost_price DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (import_id, variant_id),
  FOREIGN KEY (import_id) REFERENCES import_orders(import_id),
  FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id)
);

-- Customers
CREATE TABLE IF NOT EXISTS customer (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_id INT NOT NULL,
  staff_id INT,
  order_type VARCHAR(50),
  status VARCHAR(50),
  shipping_address TEXT,
  billing_address TEXT,
  shipping_fee DECIMAL(15,2),
  total_amount DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- Order Details
CREATE TABLE IF NOT EXISTS order_details (
  order_id INT NOT NULL,
  variant_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (order_id, variant_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50),
  amount DECIMAL(15,2),
  status VARCHAR(50),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Discounts
CREATE TABLE IF NOT EXISTS discounts (
  discount_id INT AUTO_INCREMENT PRIMARY KEY,
  discount_code VARCHAR(100) UNIQUE,
  discount_type VARCHAR(50),
  discount_value DECIMAL(15,2),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Order Discounts
CREATE TABLE IF NOT EXISTS order_discounts (
  order_id INT NOT NULL,
  discount_id INT NOT NULL,
  PRIMARY KEY (order_id, discount_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
);

-- Returns
CREATE TABLE IF NOT EXISTS returns (
  return_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  variant_id INT,
  quantity INT,
  reason TEXT,
  status VARCHAR(50),
  return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id)
);

-- Inventory Transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  variant_id INT NOT NULL,
  quantity INT,
  transaction_type VARCHAR(50),
  reference_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES product_variant(variant_id)
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(100),
  record_id INT,
  action VARCHAR(50),
  old_data TEXT,
  new_data TEXT,
  user_id INT,
  user_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO category (category_name) VALUES ('Áo'), ('Quần'), ('Váy'), ('Phụ kiện'), ('Giày dép');

INSERT IGNORE INTO staff (staff_name, role, phone, hire_date, status) VALUES
  ('Nguyễn Văn An', 'Manager', '0901234567', '2022-01-15', 'active'),
  ('Trần Thị Bình', 'Cashier', '0912345678', '2023-03-20', 'active'),
  ('Lê Minh Cường', 'Sales', '0923456789', '2023-06-01', 'active');

INSERT IGNORE INTO suppliers (supplier_name, contact_person, phone, email) VALUES
  ('Công ty Thời trang ABC', 'Nguyễn Thành', '0800123456', 'abc@fashion.vn'),
  ('Xưởng may XYZ', 'Trần Hoa', '0800234567', 'xyz@may.vn');

INSERT IGNORE INTO customer (full_name, phone, email) VALUES
  ('Phạm Thị Lan', '0931111111', 'lan@email.com'),
  ('Hoàng Văn Nam', '0932222222', 'nam@email.com'),
  ('Đặng Thị Hồng', '0933333333', 'hong@email.com');

SELECT 'Database setup complete! ✓' AS Status;
