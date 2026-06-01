const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY supplier_id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { supplier_name, contact_person, phone, email } = req.body;
    const [result] = await db.query('INSERT INTO suppliers (supplier_name,contact_person,phone,email) VALUES (?,?,?,?)',
      [supplier_name, contact_person, phone, email]);
    res.json({ supplier_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { supplier_name, contact_person, phone, email } = req.body;
    await db.query('UPDATE suppliers SET supplier_name=?,contact_person=?,phone=?,email=? WHERE supplier_id=?',
      [supplier_name, contact_person, phone, email, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM suppliers WHERE supplier_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
