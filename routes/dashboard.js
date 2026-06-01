const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/stats', async (req, res) => {
  try {
    const [[orders]] = await db.query('SELECT COUNT(*) as count, COALESCE(SUM(total_amount),0) as revenue FROM orders');
    const [[customers]] = await db.query('SELECT COUNT(*) as count FROM customer');
    const [[products]] = await db.query('SELECT COUNT(*) as count FROM product');
    const [[lowStock]] = await db.query('SELECT COUNT(*) as count FROM product_variant WHERE stock_quantity < 10');
    const [recentOrders] = await db.query(`
      SELECT o.order_id, c.full_name, o.total_amount, o.status, o.order_date
      FROM orders o JOIN customer c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC LIMIT 5
    `);
    const [topProducts] = await db.query(`
      SELECT p.name, SUM(od.quantity) as sold
      FROM order_details od
      JOIN product_variant pv ON od.variant_id = pv.variant_id
      JOIN product p ON pv.product_id = p.product_id
      GROUP BY p.product_id, p.name ORDER BY sold DESC LIMIT 5
    `);
    res.json({ orders: orders.count, revenue: orders.revenue, customers: customers.count, products: products.count, lowStock: lowStock.count, recentOrders, topProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
