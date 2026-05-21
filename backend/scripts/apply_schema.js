const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function applySchema() {
    try {
        const sqlPath = path.join(__dirname, '..', 'schema.sql');
        let sql = fs.readFileSync(sqlPath, 'utf8');
        // Remove SQL comments that start with --
        sql = sql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n');
        // Split statements on semicolon
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

        for (const stmt of statements) {
            try {
                await db.query(stmt);
            } catch (err) {
                // Log and continue for statements like CREATE DATABASE if not applicable
                console.error('Statement failed:', err.message);
            }
        }

        console.log('Schema applied (attempted all statements).');
        process.exit(0);
    } catch (err) {
        console.error('Failed to apply schema:', err);
        process.exit(1);
    }
}

applySchema();
