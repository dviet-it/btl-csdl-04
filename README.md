# 🧵 Fashion Store Manager

Hệ thống quản lý cửa hàng thời trang — Node.js + MySQL

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt dependencies

```bash
cd fashion-store
npm install
```

### 2. Tạo database MySQL

Chạy script SQL để tạo bảng và dữ liệu mẫu:

```bash
mysql -u root -p < setup.sql
```

Hoặc mở MySQL Workbench / phpMyAdmin và chạy nội dung file `setup.sql`.

### 3. Cấu hình kết nối

Chỉnh sửa file `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fashion_store
PORT=3000
```

### 4. Khởi động server

```bash
npm start
```

Truy cập: **http://localhost:3000**

---

## 📋 Tính năng

| Module | Chức năng |
|--------|-----------|
| 📊 Dashboard | Thống kê tổng quan, đơn hàng gần đây, top sản phẩm |
| 🏷️ Danh mục | CRUD danh mục sản phẩm |
| 👗 Sản phẩm | Quản lý sản phẩm (tên, mô tả, danh mục, trạng thái) |
| 🎨 Biến thể SP | SKU, size, màu sắc, giá bán, tồn kho |
| 🏭 Nhà cung cấp | Thông tin nhà cung cấp |
| 📦 Đơn nhập hàng | Quản lý đơn nhập từ NCC |
| 👥 Khách hàng | CRUD thông tin khách hàng |
| 👤 Nhân viên | Quản lý nhân sự, vai trò |
| 🛍️ Đơn hàng | Tạo/sửa đơn hàng online & offline |
| 💳 Thanh toán | Ghi nhận thanh toán, phương thức |
| 🎟️ Mã giảm giá | Voucher theo phần trăm hoặc số tiền |
| 🔄 Trả hàng | Phiếu trả hàng, lý do, trạng thái |
| 📋 Giao dịch kho | Lịch sử nhập/xuất kho |
| 📝 Audit Log | Log thao tác (read-only) |

## 📁 Cấu trúc thư mục

```
fashion-store/
├── server.js          # Entry point
├── .env               # Cấu hình môi trường
├── setup.sql          # Script tạo DB
├── config/
│   └── db.js          # Kết nối MySQL
├── routes/            # API endpoints
│   ├── dashboard.js
│   ├── categories.js
│   ├── products.js
│   ├── variants.js
│   ├── suppliers.js
│   ├── importOrders.js
│   ├── customers.js
│   ├── staff.js
│   ├── orders.js
│   ├── payments.js
│   ├── discounts.js
│   ├── returns.js
│   ├── inventory.js
│   └── audit.js
└── public/
    └── index.html     # Frontend SPA
```
