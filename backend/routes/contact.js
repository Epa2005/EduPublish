const express = require('express');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const router = express.Router();

// POST /api/contact — receive a contact form submission
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    // Attempt to send email notification (non-blocking)
    if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: process.env.MAIL_SECURE === 'true',
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      });

      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        subject: `New Contact Message from ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
      });
    }

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET /api/contact — get all messages (admin only)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/contact/:id/read — mark message as read
router.put('/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET is_read = 1 WHERE message_id = ?', [req.params.id]);
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
