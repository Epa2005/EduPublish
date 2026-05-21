const express = require('express');
const db = require('../config/db');
const { authenticate, authorizeTeacher } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all notes (public - for students to view/download)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT n.*, t.full_name AS uploaded_by_name FROM student_notes n LEFT JOIN teachers t ON n.uploaded_by = t.teacher_id ORDER BY n.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get notes by subject
router.get('/subject/:subject', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT n.*, t.full_name AS uploaded_by_name FROM student_notes n LEFT JOIN teachers t ON n.uploaded_by = t.teacher_id WHERE n.subject = ? ORDER BY n.created_at DESC',
      [req.params.subject]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get teacher's own notes
router.get('/my-notes', authenticate, authorizeTeacher, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM student_notes WHERE uploaded_by = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Upload note (teacher only)
router.post('/', authenticate, authorizeTeacher, upload.single('file'), async (req, res) => {
  const { title, subject } = req.body;
  if (!title || !subject || !req.file) {
    return res.status(400).json({ message: 'Title, subject, and file are required.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  try {
    const [result] = await db.query(
      'INSERT INTO student_notes (title, subject, file_url, uploaded_by) VALUES (?, ?, ?, ?)',
      [title, subject, fileUrl, req.user.id]
    );
    res.status(201).json({ message: 'Note uploaded successfully.', note_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update note (teacher only - own notes)
router.put('/:id', authenticate, authorizeTeacher, upload.single('file'), async (req, res) => {
  const { title, subject } = req.body;
  try {
    let query = 'UPDATE student_notes SET title = ?, subject = ?';
    const params = [title, subject];

    if (req.file) {
      query += ', file_url = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE note_id = ? AND uploaded_by = ?';
    params.push(req.params.id, req.user.id);

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found or unauthorized.' });
    }
    res.json({ message: 'Note updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete note (teacher only - own notes)
router.delete('/:id', authenticate, authorizeTeacher, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM student_notes WHERE note_id = ? AND uploaded_by = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found or unauthorized.' });
    }
    res.json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
