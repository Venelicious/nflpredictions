const dotenv = require('dotenv');
const { buildApp } = require('./app');
const { getPool } = require('./db');

dotenv.config();

async function start() {
  const app = buildApp();
  const port = process.env.PORT || 4000;

  // Validate DB connection before starting
  await getPool().query('SELECT 1');

  app.listen(port, () => {
    console.log(`API server läuft auf Port ${port}`);
  });
}

start().catch(err => {
  console.error('Serverstart fehlgeschlagen', err);
  process.exit(1);
});
