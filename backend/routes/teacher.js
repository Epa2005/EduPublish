const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Teacher login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM teachers WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const teacher = rows[0];
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { id: teacher.teacher_id, full_name: teacher.full_name, email: teacher.email, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, teacher: { id: teacher.teacher_id, full_name: teacher.full_name, email: teacher.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get teacher profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT teacher_id, full_name, email, created_at FROM teachers WHERE teacher_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
