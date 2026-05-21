const express = require('express');
const db = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all published events (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT e.*, a.username AS created_by_name FROM events e LEFT JOIN admin a ON e.created_by = a.admin_id ORDER BY e.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT e.*, a.username AS created_by_name FROM events e LEFT JOIN admin a ON e.created_by = a.admin_id WHERE e.event_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create event (admin only)
router.post('/', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  console.log('EVENT CREATE - req.body:', req.body);
  console.log('EVENT CREATE - req.file:', req.file);
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const [result] = await db.query(
      'INSERT INTO events (title, description, image, created_by) VALUES (?, ?, ?, ?)',
      [title, description || '', image, req.user.id]
    );
    res.status(201).json({ message: 'Event created successfully.', event_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update event (admin only)
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  try {
    let query = 'UPDATE events SET title = ?, description = ?';
    const params = [title, description];

    if (req.file) {
      query += ', image = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE event_id = ?';
    params.push(req.params.id);

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json({ message: 'Event updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM events WHERE event_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
