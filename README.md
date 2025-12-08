<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NFL Predictions</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="page-header">
    <div class="logo">NFL Predictions</div>
    <div class="auth-area" id="authArea">
      <form id="loginForm" class="auth-form hidden">
        <input type="email" id="loginEmail" placeholder="E-Mail" required>
        <input type="password" id="loginPassword" placeholder="Passwort" required>
        <button type="submit">Anmelden</button>
        <p class="helper">Noch kein Account? <button type="button" class="linkish" id="showRegister">Registrieren</button></p>
      </form>
      <form id="registerForm" class="auth-form hidden">
        <input type="text" id="registerName" placeholder="Anzeigename" required>
        <input type="email" id="registerEmail" placeholder="E-Mail" required>
        <input type="password" id="registerPassword" placeholder="Passwort" required>
        <button type="submit">Registrieren</button>
        <p class="helper">Bereits registriert? <button type="button" class="linkish" id="showLogin">Anmelden</button></p>
      </form>
      <div id="welcomeArea" class="welcome hidden">
        <div>
          <p class="welcome__name">Eingeloggt als <span id="welcomeName"></span></p>
          <p class="welcome__email" id="welcomeEmail"></p>
        </div>
        <button id="logoutBtn" class="secondary">Abmelden</button>
      </div>
    </div>
  </header>

  <main>
    <section id="tabs" class="hidden">
      <nav class="tab-nav">
        <button class="tab-button active" data-tab="profileTab">Profil</button>
        <button class="tab-button" data-tab="predictionsTab">Tipps</button>
        <button class="tab-button" data-tab="statsTab">NFL Stats</button>
        <button class="tab-button" data-tab="overviewTab">Tipps-Übersicht</button>
      </nav>

      <div class="tab-content">
        <section id="profileTab" class="tab-pane active">
          <h2>Profil</h2>
          <form id="profileForm" class="card">
            <div class="form-row">
              <label for="profileName">Anzeigename</label>
              <input type="text" id="profileName" required>
            </div>
            <div class="form-row">
              <label for="profileEmail">E-Mail</label>
              <input type="email" id="profileEmail" disabled>
              <p class="hint">Die E-Mail dient als Benutzerkennung und kann nicht geändert werden.</p>
            </div>
            <div class="form-row">
              <label for="profileFavorite">Lieblingsteam</label>
              <select id="profileFavorite">
                <option value="">-- wähle ein Team --</option>
              </select>
            </div>
            <button type="submit">Profil speichern</button>
            <p class="status" id="profileStatus"></p>
          </form>
        </section>

        <section id="predictionsTab" class="tab-pane">
          <div class="pane-header">
            <h2>Tipps für jede Division (17 Spieltage)</h2>
            <div class="lock-info" id="lockInfo"></div>
          </div>
          <p class="hint">Sortiere alle 32 Teams innerhalb ihrer Division (Platz 1-4) und trage deine erwartete Bilanz ein (z. B. 10-7). Jede Platzierung darf pro Division nur einmal vergeben werden.</p>
          <div class="table-scroll">
            <table class="pred-table" id="predictionsTable">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Conference</th>
                  <th>Division</th>
                  <th>Platzierung</th>
                  <th>Bilanz (S-N)</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="actions">
            <button id="savePredictions" disabled>Tipps speichern</button>
            <p class="status" id="predictionStatus"></p>
          </div>
        </section>

        <section id="statsTab" class="tab-pane">
          <div class="pane-header">
            <h2>Aktuelle NFL Statistiken</h2>
            <div class="pane-actions">
              <label class="season-picker">
                Saison:
                <select id="seasonSelect"></select>
              </label>
              <button id="refreshStats" class="secondary">Neu laden</button>
            </div>
          </div>
          <div id="statsContent" class="card">Starte eine Aktualisierung…</div>
        </section>

        <section id="overviewTab" class="tab-pane">
          <div class="pane-header">
            <h2>Vorhersagen aller Benutzer</h2>
            <p id="overviewStatus" class="hint"></p>
          </div>
          <div id="overviewContent" class="card"></div>
        </section>
      </div>
    </section>

    <section id="welcomeHero" class="hero">
      <div class="hero__content">
        <h1>Erstelle deine NFL-Vorhersagen</h1>
        <p>Registriere dich, tippe die finale Tabelle nach 17 Spieltagen und vergleiche deine Prognosen.</p>
        <button id="startNow" class="cta">Jetzt starten</button>
      </div>
      <div class="hero__img" aria-hidden="true">🏈</div>
    </section>
  </main>

  <footer>
    <p>Keine externe Datenbank nötig – alles bleibt lokal in deinem Browser.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```
