const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { id: admin.admin_id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, admin: { id: admin.admin_id, username: admin.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create teacher account (admin only)
router.post('/teachers', authenticate, authorizeAdmin, async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO teachers (full_name, email, password) VALUES (?, ?, ?)',
      [full_name, email, hashedPassword]
    );
    res.status(201).json({ message: 'Teacher created successfully.', teacher_id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all teachers (admin only)
router.get('/teachers', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT teacher_id, full_name, email, created_at FROM teachers ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete teacher (admin only)
router.delete('/teachers/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM teachers WHERE teacher_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json({ message: 'Teacher deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reset teacher password (admin only)
router.put('/teachers/:id/reset-password', authenticate, authorizeAdmin, async (req, res) => {
  const { new_password } = req.body;
  if (!new_password) {
    return res.status(400).json({ message: 'New password is required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const [result] = await db.query('UPDATE teachers SET password = ? WHERE teacher_id = ?', [
      hashedPassword,
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
