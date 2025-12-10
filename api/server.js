const dotenv = require('dotenv');
const { buildApp } = require('./app');
const { getPool } = require('./db');

dotenv.config();

async function start() {
  const app = buildApp();
  const port = process.env.PORT || 4000;

  // Validate DB connection before starting
  try {
    await getPool().query('SELECT 1');
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error(
        'Keine Verbindung zur Datenbank möglich. Bitte prüfe, ob MySQL läuft und die Zugangsdaten stimmen.',
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT || 3306,
          user: process.env.DB_USER,
          database: process.env.DB_NAME,
        },
      );
    }
    throw err;
  }

  app.listen(port, () => {
    console.log(`API server läuft auf Port ${port}`);
  });
}

start().catch(err => {
  console.error('Serverstart fehlgeschlagen', err);
  process.exit(1);
});
