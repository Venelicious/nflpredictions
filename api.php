<?php
// Simple PHP API for NFL Predictions
header('Content-Type: application/json');

// ===== Configuration =====
const DB_HOST = 'database-5019178721.webspace-host.com';
const DB_NAME = 'dbs15059918';
const DB_USER = 'dbu5771551';
const DB_PASS = 'Wosini16.10.10!';
const SESSION_COOKIE = 'session_token';
const SESSION_LIFETIME_DAYS = 30;

// ===== Helpers =====
function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function get_pdo(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function get_json_input(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function parse_path(): string {
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    if (str_starts_with($uriPath, $script)) {
        $uriPath = substr($uriPath, strlen($script));
    }
    return rtrim($uriPath, '/') ?: '/';
}

function set_session_cookie(string $token): void {
    $expires = time() + (SESSION_LIFETIME_DAYS * 86400);
    setcookie(SESSION_COOKIE, $token, [
        'expires' => $expires,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function clear_session_cookie(): void {
    setcookie(SESSION_COOKIE, '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function require_auth(): array {
    $pdo = get_pdo();
    $token = $_COOKIE[SESSION_COOKIE] ?? '';
    if (!$token) respond(401, ['error' => 'Nicht eingeloggt']);

    $tokenHash = hash('sha256', $token);
    $sql = 'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
            WHERE s.token_hash = :hash AND s.expires_at > NOW() LIMIT 1';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['hash' => $tokenHash]);
    $user = $stmt->fetch();

    if (!$user) {
        clear_session_cookie();
        respond(401, ['error' => 'Session ungültig']);
    }

    return $user;
}

function user_payload(array $user): array {
    return [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'favorite_team' => $user['favorite_team'] ?? null,
    ];
}

function create_session(int $userId): string {
    $pdo = get_pdo();
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);

    $stmt = $pdo->prepare('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (:uid, :hash, :exp)');
    $stmt->execute([
        'uid' => $userId,
        'hash' => $hash,
        'exp' => date('Y-m-d H:i:s', time() + SESSION_LIFETIME_DAYS * 86400),
    ]);

    set_session_cookie($token);
    return $token;
}

function handle_register(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Methode nicht erlaubt']);
    $data = get_json_input();

    $name = trim($data['name'] ?? '');
    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';

    if (!$name) respond(400, ['error' => 'Name fehlt']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(400, ['error' => 'Ungültige E-Mail']);
    if (strlen($password) < 6) respond(400, ['error' => 'Passwort zu kurz']);

    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) respond(409, ['error' => 'E-Mail bereits registriert']);

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :pw)');
    $stmt->execute(['name' => $name, 'email' => $email, 'pw' => $passwordHash]);

    $userId = (int)$pdo->lastInsertId();
    create_session($userId);

    respond(201, ['user' => user_payload(['id' => $userId, 'name' => $name, 'email' => $email, 'favorite_team' => null])]);
}

function handle_login(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Methode nicht erlaubt']);
    $data = get_json_input();

    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(400, ['error' => 'Ungültige E-Mail']);

    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        respond(401, ['error' => 'E-Mail oder Passwort falsch']);
    }

    create_session((int)$user['id']);
    respond(200, ['user' => user_payload($user)]);
}

function handle_logout(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Methode nicht erlaubt']);
    $token = $_COOKIE[SESSION_COOKIE] ?? '';
    if ($token) {
        $hash = hash('sha256', $token);
        $pdo = get_pdo();
        $stmt = $pdo->prepare('DELETE FROM sessions WHERE token_hash = :hash');
        $stmt->execute(['hash' => $hash]);
    }
    clear_session_cookie();
    respond(200, ['success' => true]);
}

function handle_me(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(405, ['error' => 'Methode nicht erlaubt']);
    $user = require_auth();
    respond(200, ['user' => user_payload($user)]);
}

function handle_list_tips(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(405, ['error' => 'Methode nicht erlaubt']);
    $user = require_auth();

    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT id, season, game_id, predicted_winner, payload FROM tips WHERE user_id = :uid ORDER BY season DESC, id DESC');
    $stmt->execute(['uid' => $user['id']]);
    $tips = $stmt->fetchAll();

    respond(200, ['tips' => array_map(function ($tip) {
        if (is_string($tip['payload'])) {
            $decoded = json_decode($tip['payload'], true);
            $tip['payload'] = $decoded ?: $tip['payload'];
        }
        $tip['id'] = (int)$tip['id'];
        $tip['game_id'] = $tip['game_id'] !== null ? (int)$tip['game_id'] : null;
        return $tip;
    }, $tips)]);
}

function handle_save_tip(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['error' => 'Methode nicht erlaubt']);
    $user = require_auth();
    $data = get_json_input();

    $season = substr(trim($data['season'] ?? ''), 0, 10);
    $payload = $data['payload'] ?? null;

    if (!$season) respond(400, ['error' => 'Season fehlt']);
    if (!is_array($payload)) respond(400, ['error' => 'Payload ungültig']);

    $pdo = get_pdo();

    // Check if a tip for this season already exists
    $existingStmt = $pdo->prepare('SELECT id FROM tips WHERE user_id = :uid AND season = :season AND game_id IS NULL LIMIT 1');
    $existingStmt->execute(['uid' => $user['id'], 'season' => $season]);
    $existingId = $existingStmt->fetchColumn();

    if ($existingId) {
        $stmt = $pdo->prepare('UPDATE tips SET payload = :payload, updated_at = CURRENT_TIMESTAMP WHERE id = :id');
        $stmt->execute(['payload' => json_encode($payload), 'id' => $existingId]);
        $tipId = (int)$existingId;
    } else {
        $stmt = $pdo->prepare('INSERT INTO tips (user_id, season, game_id, predicted_winner, payload)
          VALUES (:uid, :season, NULL, NULL, :payload)');
        $stmt->execute([
            'uid' => $user['id'],
            'season' => $season,
            'payload' => json_encode($payload),
        ]);
        $tipId = (int)$pdo->lastInsertId();
    }

    respond(200, [
        'tip' => [
          'id' => $tipId,
          'season' => $season,
          'game_id' => null,
          'predicted_winner' => null,
          'payload' => $payload,
        ],
    ]);
}

// ===== Routing =====
$path = parse_path();

try {
    switch ($path) {
        case '/auth/register':
            handle_register();
            break;
        case '/auth/login':
            handle_login();
            break;
        case '/auth/logout':
            handle_logout();
            break;
        case '/auth/me':
            handle_me();
            break;
        case '/tips':
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                handle_list_tips();
            } else {
                handle_save_tip();
            }
            break;
        case '/':
        case '':
            respond(200, ['status' => 'OK']);
            break;
        default:
            respond(404, ['error' => 'Route nicht gefunden', 'path' => $path]);
    }
} catch (Throwable $e) {
    respond(500, ['error' => 'Interner Fehler', 'details' => $e->getMessage()]);
}
