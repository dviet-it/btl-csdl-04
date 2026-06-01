const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pv.*, p.name as product_name FROM product_variant pv
      LEFT JOIN product p ON pv.product_id = p.product_id
      ORDER BY pv.variant_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { product_id, sku, barcode, size, color, price, cost_price, stock_quantity, image_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO product_variant (product_id,sku,barcode,size,color,price,cost_price,stock_quantity,image_url,created_at) VALUES (?,?,?,?,?,?,?,?,?,NOW())',
      [product_id, sku, barcode, size, color, price, cost_price, stock_quantity || 0, image_url]
    );
    res.json({ variant_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { product_id, sku, barcode, size, color, price, cost_price, stock_quantity, image_url } = req.body;
    await db.query(
      'UPDATE product_variant SET product_id=?,sku=?,barcode=?,size=?,color=?,price=?,cost_price=?,stock_quantity=?,image_url=? WHERE variant_id=?',
      [product_id, sku, barcode, size, color, price, cost_price, stock_quantity, image_url, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM product_variant WHERE variant_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
