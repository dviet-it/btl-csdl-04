const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT it.*, pv.sku, p.name as product_name FROM inventory_transactions it
      LEFT JOIN product_variant pv ON it.variant_id = pv.variant_id
      LEFT JOIN product p ON pv.product_id = p.product_id
      ORDER BY it.transaction_id DESC LIMIT 200
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { variant_id, quantity, transaction_type, reference_id } = req.body;
    const [result] = await db.query('INSERT INTO inventory_transactions (variant_id,quantity,transaction_type,reference_id,created_at) VALUES (?,?,?,?,NOW())',
      [variant_id, quantity, transaction_type, reference_id]);
    res.json({ transaction_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
