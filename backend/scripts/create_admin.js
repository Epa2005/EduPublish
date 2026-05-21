const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function ensureAdmin() {
    try {
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const username = process.env.ADMIN_USERNAME || 'admin';
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO admin (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
            [username, hash]
        );
        console.log(`Ensured admin '${username}' with provided password.`);
        process.exit(0);
    } catch (err) {
        console.error('Failed to ensure admin:', err);
        process.exit(1);
    }
}

ensureAdmin();
