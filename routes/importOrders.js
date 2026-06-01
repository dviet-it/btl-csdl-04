const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT io.*, s.supplier_name, st.staff_name FROM import_orders io
      LEFT JOIN suppliers s ON io.supplier_id = s.supplier_id
      LEFT JOIN staff st ON io.staff_id = st.staff_id
      ORDER BY io.import_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/details', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT iod.*, pv.sku, p.name as product_name FROM import_order_details iod
      LEFT JOIN product_variant pv ON iod.variant_id = pv.variant_id
      LEFT JOIN product p ON pv.product_id = p.product_id
      WHERE iod.import_id=?
    `, [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { supplier_id, staff_id, total_cost, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO import_orders (supplier_id,staff_id,import_date,total_cost,status) VALUES (?,?,NOW(),?,?)',
      [supplier_id, staff_id, total_cost, status]
    );
    res.json({ import_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { supplier_id, staff_id, total_cost, status } = req.body;
    await db.query('UPDATE import_orders SET supplier_id=?,staff_id=?,total_cost=?,status=? WHERE import_id=?',
      [supplier_id, staff_id, total_cost, status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM import_order_details WHERE import_id=?', [req.params.id]);
    await db.query('DELETE FROM import_orders WHERE import_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
