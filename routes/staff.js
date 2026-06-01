const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM staff ORDER BY staff_id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { staff_name, role, phone, hire_date, status } = req.body;
    const [result] = await db.query('INSERT INTO staff (staff_name,role,phone,hire_date,status) VALUES (?,?,?,?,?)',
      [staff_name, role, phone, hire_date, status]);
    res.json({ staff_id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { staff_name, role, phone, hire_date, status } = req.body;
    await db.query('UPDATE staff SET staff_name=?,role=?,phone=?,hire_date=?,status=? WHERE staff_id=?',
      [staff_name, role, phone, hire_date, status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM staff WHERE staff_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
