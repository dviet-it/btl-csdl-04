const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, p.name as product_name, pv.sku FROM returns r
      LEFT JOIN product_variant pv ON r.variant_id = pv.variant_id
      LEFT JOIN product p ON pv.product_id = p.product_id
      ORDER BY r.return_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { order_id, variant_id, quantity, reason, status } = req.body;
    const [result] = await db.query('INSERT INTO returns (order_id,variant_id,quantity,reason,status,return_date) VALUES (?,?,?,?,?,NOW())',
      [order_id, variant_id, quantity, reason, status]);
    res.json({ return_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { order_id, variant_id, quantity, reason, status } = req.body;
    await db.query('UPDATE returns SET order_id=?,variant_id=?,quantity=?,reason=?,status=? WHERE return_id=?',
      [order_id, variant_id, quantity, reason, status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM returns WHERE return_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
