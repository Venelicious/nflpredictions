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
