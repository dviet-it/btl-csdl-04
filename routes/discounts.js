const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM discounts ORDER BY discount_id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { discount_code, discount_type, discount_value, start_date, end_date, is_active } = req.body;
    const [result] = await db.query('INSERT INTO discounts (discount_code,discount_type,discount_value,start_date,end_date,is_active) VALUES (?,?,?,?,?,?)',
      [discount_code, discount_type, discount_value, start_date, end_date, is_active]);
    res.json({ discount_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { discount_code, discount_type, discount_value, start_date, end_date, is_active } = req.body;
    await db.query('UPDATE discounts SET discount_code=?,discount_type=?,discount_value=?,start_date=?,end_date=?,is_active=? WHERE discount_id=?',
      [discount_code, discount_type, discount_value, start_date, end_date, is_active, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM discounts WHERE discount_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
