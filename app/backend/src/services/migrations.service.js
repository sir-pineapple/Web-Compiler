const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const runMigrations = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            applied_at TIMESTAMP DEFAULT NOW()
        )
    `);

    const migrationsDir = path.join(__dirname, "../migrations");
    const files = fs.readdirSync(migrationsDir).sort();
    const applied = await pool.query(`SELECT filename from schema_migrations`);
    const appliedSet = new Set(applied.rows.map(row => row.filename));

    for (const file of files) {
        if (appliedSet.has(file)) {
            continue;
        }
        console.log(`Running migration; ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

        await pool.query(`INSERT INTO schema_migrations (filename) VALUES ($1)`, [file]);
        console.log(`Migration applied: ${file}`);
    }
};

module.exports = { runMigrations };