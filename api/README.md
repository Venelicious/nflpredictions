# Backend API

Eine kleine Express-API mit MySQL-Anbindung für Registrierung, Login, Sessions und Tipps.

## Setup

1. Kopiere `.env.example` nach `.env` und trage deine Datenbank-Zugangsdaten ein.
2. Führe die Migrationen aus:
   ```bash
   npm run migrate
   ```
3. Starte den Server:
   ```bash
   npm start
   ```

Standardmäßig lauscht der Server auf Port `4000` und erwartet einen MySQL-Server mit den in `.env` hinterlegten Zugangsdaten.

Falls der Start mit `ECONNREFUSED ::1:3306` oder einer ähnlichen Meldung abbricht, läuft der MySQL-Dienst nicht oder ist unter Host/Port aus `.env` nicht erreichbar. Starte den MySQL-Server (z. B. `mysqld` oder `docker-compose up`) oder passe Host/Port/Passwort in `.env` an.

## Datenbank direkt in MySQL 8.0 anlegen

Falls die Datenbank noch nicht existiert, kannst du sie mit dem SQL-Skript `api/database-setup.sql` vollständig einrichten (Datenbank, User und Tabellen).

```bash
mysql -u root -p < api/database-setup.sql
```

Passe bei Bedarf im Skript Host oder Passwort an. Anschließend kannst du wie gewohnt `npm run migrate` ausführen, um sicherzustellen, dass alle Tabellen auf dem aktuellen Stand sind.
