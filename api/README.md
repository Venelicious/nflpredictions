# PHP Backend API

Dieses Verzeichnis enthält eine schlanke PHP-API mit MySQL-Anbindung für Registrierung, Login, Sessions sowie das Verwalten von Tipps und Spielen. Node/Express wird nicht mehr verwendet.

## Voraussetzungen

- PHP 8 mit PDO-MySQL Erweiterung
- Ein laufender MySQL 8.x Server

## Einrichtung

1. Kopiere `.env.example` nach `.env` und passe die Datenbank- und Cookie-Einstellungen an.
2. Erstelle die Datenbank und Tabellen mit dem vorhandenen SQL-Skript:
   ```bash
   mysql -u <user> -p < api/database-setup.sql
   ```
3. Starte die API z. B. über den eingebauten PHP-Server:
   ```bash
   php -S 0.0.0.0:4000 -t api
   ```

Die API ist unter `http://localhost:4000/api` erreichbar. Für den lokalen Aufruf aus dem Frontend kann die Variable `CLIENT_ORIGIN` genutzt werden, damit Cookies korrekt gesetzt werden.

## Verfügbare Endpunkte

- `GET /api/health` – einfacher Health-Check
- `POST /api/auth/register` – Registrierung (JSON: `name`, `email`, `password`)
- `POST /api/auth/login` – Anmeldung (JSON: `email`, `password`)
- `POST /api/auth/logout` – Session löschen und Cookie entfernen
- `GET /api/auth/me` – aktuellen Benutzer zurückgeben (erfordert Authentifizierung)
- `PUT /api/auth/profile` – Profil aktualisieren (`name`, `favorite_team`)
- `GET /api/session` – Session-Status inklusive Benutzer laden
- `GET /api/games` – Spiele abrufen (erfordert Authentifizierung)
- `GET /api/tips` – Eigene Tipps abrufen (erfordert Authentifizierung)
- `POST /api/tips` – Tipp speichern oder aktualisieren (`season`, optional `gameId`, `predictedWinner`, `payload`)
- `PUT /api/tips/:id` – Tipp anpassen

Alle Endpunkte liefern und erwarten JSON. Session-Tokens werden als HTTP-only Cookie `session_token` verwaltet.
