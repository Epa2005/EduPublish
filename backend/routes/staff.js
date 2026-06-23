const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM staff_members ORDER BY display_order ASC, full_name ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch staff members.' });
  }
});

router.post('/', authenticate, authorizeAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { full_name, position, display_order } = req.body;
    if (!full_name || !position) {
      return res.status(400).json({ message: 'Full name and position are required.' });
    }
    const photo = req.file ? '/uploads/' + req.file.filename : null;
    const order = display_order || 0;
    const [result] = await db.query(
      'INSERT INTO staff_members (full_name, position, photo, display_order) VALUES (?, ?, ?, ?)',
      [full_name, position, photo, order]
    );
    const [rows] = await db.query('SELECT * FROM staff_members WHERE staff_id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create staff member.' });
  }
});

router.put('/:id', authenticate, authorizeAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { full_name, position, display_order } = req.body;
    const staffId = req.params.id;
    if (!full_name || !position) {
      return res.status(400).json({ message: 'Full name and position are required.' });
    }
    let query = 'UPDATE staff_members SET full_name = ?, position = ?, display_order = ?';
    const params = [full_name, position, display_order || 0];
    if (req.file) {
      query += ', photo = ?';
      params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE staff_id = ?';
    params.push(staffId);
    await db.query(query, params);
    const [rows] = await db.query('SELECT * FROM staff_members WHERE staff_id = ?', [staffId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Staff member not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update staff member.' });
  }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM staff_members WHERE staff_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff member not found.' });
    }
    res.json({ message: 'Staff member deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete staff member.' });
  }
});

module.exports = router;
