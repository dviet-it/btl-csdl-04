const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.category_name FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      ORDER BY p.product_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, category_id, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO product (name, description, category_id, status, created_at) VALUES (?,?,?,?,NOW())',
      [name, description, category_id, status]
    );
    res.json({ product_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description, category_id, status } = req.body;
    await db.query('UPDATE product SET name=?, description=?, category_id=?, status=? WHERE product_id=?',
      [name, description, category_id, status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM product WHERE product_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
