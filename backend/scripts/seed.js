const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS staff_members (
        staff_id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(150) NOT NULL,
        position VARCHAR(255) NOT NULL,
        photo VARCHAR(255),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    // Check if admin exists
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM admin');
    if (rows[0].count === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await db.query('INSERT INTO admin (username, password) VALUES (?, ?)', ['admin', hash]);
      console.log('Default admin created: username=admin, password=admin123');
    } else {
      // Ensure the default admin password is up-to-date with a proper hash
      const hash = await bcrypt.hash('admin123', 10);
      await db.query('UPDATE admin SET password = ? WHERE username = ?', [hash, 'admin']);
      console.log('Admin password synchronized.');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

module.exports = seed;
