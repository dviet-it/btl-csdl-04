const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, c.full_name as customer_name, s.staff_name FROM orders o
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN staff s ON o.staff_id = s.staff_id
      ORDER BY o.order_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/details', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT od.*, pv.sku, pv.size, pv.color, p.name as product_name FROM order_details od
      LEFT JOIN product_variant pv ON od.variant_id = pv.variant_id
      LEFT JOIN product p ON pv.product_id = p.product_id
      WHERE od.order_id=?
    `, [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { customer_id, staff_id, order_type, status, shipping_address, billing_address, shipping_fee, total_amount } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (order_date,customer_id,staff_id,order_type,status,shipping_address,billing_address,shipping_fee,total_amount,created_at,updated_at) VALUES (NOW(),?,?,?,?,?,?,?,?,NOW(),NOW())',
      [customer_id, staff_id, order_type, status, shipping_address, billing_address, shipping_fee, total_amount]
    );
    res.json({ order_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { customer_id, staff_id, order_type, status, shipping_address, billing_address, shipping_fee, total_amount } = req.body;
    await db.query('UPDATE orders SET customer_id=?,staff_id=?,order_type=?,status=?,shipping_address=?,billing_address=?,shipping_fee=?,total_amount=?,updated_at=NOW() WHERE order_id=?',
      [customer_id, staff_id, order_type, status, shipping_address, billing_address, shipping_fee, total_amount, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM order_details WHERE order_id=?', [req.params.id]);
    await db.query('DELETE FROM orders WHERE order_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
