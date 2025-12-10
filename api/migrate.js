const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { getPool } = require('./db');

dotenv.config();

async function run() {
  const pool = getPool();
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(name => name.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Running migration ${file}`);
    await pool.query(sql);
  }
  await pool.end();
  console.log('Migrations abgeschlossen.');
}

run().catch(err => {
  console.error('Migration failed', err);
  process.exit(1);
});
