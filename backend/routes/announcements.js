const express = require('express');
const db = require('../config/db');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all announcements (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT a.*, adm.username AS created_by_name FROM announcements a LEFT JOIN admin adm ON a.created_by = adm.admin_id ORDER BY a.created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get single announcement
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT a.*, adm.username AS created_by_name FROM announcements a LEFT JOIN admin adm ON a.created_by = adm.admin_id WHERE a.announcement_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Announcement not found.' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Create announcement (admin)
router.post('/', authenticate, authorizeAdmin, upload.single('media'), async (req, res) => {
    const { title, body } = req.body;
    console.log('ANNOUNCEMENT CREATE - Content-Type:', req.headers['content-type']);
    console.log('ANNOUNCEMENT CREATE - req.body:', req.body);
    console.log('ANNOUNCEMENT CREATE - req.file:', req.file);
    if (!title) return res.status(400).json({ message: 'Title is required.' });
    const media = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await db.query('INSERT INTO announcements (title, body, media, created_by) VALUES (?, ?, ?, ?)', [title, body || '', media, req.user.id]);
        res.status(201).json({ message: 'Announcement created successfully.', announcement_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Update announcement (admin)
router.put('/:id', authenticate, authorizeAdmin, upload.single('media'), async (req, res) => {
    const { title, body } = req.body;
    try {
        let query = 'UPDATE announcements SET title = ?, body = ?';
        const params = [title, body];
        if (req.file) {
            query += ', media = ?';
            params.push(`/uploads/${req.file.filename}`);
        }
        query += ' WHERE announcement_id = ?';
        params.push(req.params.id);
        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Announcement not found.' });
        res.json({ message: 'Announcement updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete announcement (admin)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM announcements WHERE announcement_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Announcement not found.' });
        res.json({ message: 'Announcement deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
