const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, o.total_amount as order_total, c.full_name as customer_name FROM payments p
      LEFT JOIN orders o ON p.order_id = o.order_id
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      ORDER BY p.payment_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { order_id, payment_method, amount, status } = req.body;
    const [result] = await db.query('INSERT INTO payments (order_id,payment_date,payment_method,amount,status) VALUES (?,NOW(),?,?,?)',
      [order_id, payment_method, amount, status]);
    res.json({ payment_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { order_id, payment_method, amount, status } = req.body;
    await db.query('UPDATE payments SET order_id=?,payment_method=?,amount=?,status=? WHERE payment_id=?',
      [order_id, payment_method, amount, status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM payments WHERE payment_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
