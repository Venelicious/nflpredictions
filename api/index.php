<?php
// Simple PHP API replacing the previous Node/Express server.
// Provides registration, login, session handling and CRUD for predictions.

declare(strict_types=1);

// CORS headers
$clientOrigin = getenv('CLIENT_ORIGIN') ?: 'http://localhost:3000';
header('Access-Control-Allow-Origin: ' . $clientOrigin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

set_exception_handler(function ($exception) {
    error_log($exception);
    send_json(['error' => 'Interner Serverfehler'], 500);
});

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = getenv('DB_HOST') ?: 'localhost';
    $port = getenv('DB_PORT') ?: '3306';
    $dbName = getenv('DB_NAME') ?: 'nflpredictions';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: '';

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $dbName);
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone='+00:00'",
    ]);

    return $pdo;
}

function send_json(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function get_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function create_session_token(): string
{
    return bin2hex(random_bytes(40));
}

function hash_token(string $token): string
{
    return hash('sha256', $token);
}

function calculate_expiry(): DateTimeImmutable
{
    $days = (int) (getenv('SESSION_TTL_DAYS') ?: 7);
    $days = $days > 0 ? $days : 7;
    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    return $now->modify('+' . $days . ' days');
}

function persist_session(int $userId): void
{
    $pdo = db();
    $token = create_session_token();
    $tokenHash = hash_token($token);
    $expiresAt = calculate_expiry();

    $stmt = $pdo->prepare('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, :expires_at)');
    $stmt->execute([
        'user_id' => $userId,
        'token_hash' => $tokenHash,
        'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
    ]);

    $cookieOptions = [
        'expires' => $expiresAt->getTimestamp(),
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ];

    if (getenv('SESSION_COOKIE_SECURE') === 'true') {
        $cookieOptions['secure'] = true;
    }

    setcookie('session_token', $token, $cookieOptions);
}

function find_session(): ?array
{
    $token = $_COOKIE['session_token'] ?? '';
    if ($token === '') {
        return null;
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT s.id, s.user_id, s.expires_at, u.email, u.name, u.favorite_team
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = :token_hash AND s.expires_at > UTC_TIMESTAMP()'
    );
    $stmt->execute(['token_hash' => hash_token($token)]);
    $session = $stmt->fetch();

    return $session ?: null;
}

function require_auth(): array
{
    $session = find_session();
    if ($session === null) {
        send_json(['error' => 'Nicht authentifiziert'], 401);
    }

    return [
        'id' => (int) $session['user_id'],
        'email' => $session['email'],
        'name' => $session['name'],
        'favorite_team' => $session['favorite_team'] ?? '',
        'session_id' => (int) $session['id'],
    ];
}

function normalize_tip_payload($payload): array
{
    $safePayload = is_array($payload) ? $payload : [];
    $predictions = $safePayload['predictions'] ?? $safePayload['payload'] ?? $safePayload;
    if (!is_array($predictions)) {
        $predictions = [];
    }

    return [
        'season' => isset($safePayload['season']) ? (string) $safePayload['season'] : '',
        'predictions' => $predictions,
    ];
}

$rawPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = $rawPath === false ? '/' : $rawPath;
$path = strpos($path, '/api') === 0 ? substr($path, 4) : $path;
$method = $_SERVER['REQUEST_METHOD'];

if ($path === '/health' && $method === 'GET') {
    send_json(['status' => 'ok']);
}

if ($path === '/session' && $method === 'GET') {
    $session = find_session();
    if ($session === null) {
        send_json(['error' => 'Nicht authentifiziert'], 401);
    }
    send_json(['user' => [
        'id' => (int) $session['user_id'],
        'email' => $session['email'],
        'name' => $session['name'],
        'favorite_team' => $session['favorite_team'] ?? '',
    ]]);
}

if ($path === '/auth/register' && $method === 'POST') {
    $body = get_json_body();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';
    $name = trim($body['name'] ?? '');

    if ($email === '' || $password === '' || $name === '') {
        send_json(['error' => 'Name, E-Mail und Passwort sind erforderlich.'], 400);
    }

    $pdo = db();
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        send_json(['error' => 'E-Mail ist bereits registriert.'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $insert = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)');
    $insert->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => $passwordHash,
    ]);

    $userId = (int) $pdo->lastInsertId();
    persist_session($userId);
    send_json(['user' => ['id' => $userId, 'email' => $email, 'name' => $name]], 201);
}

if ($path === '/auth/login' && $method === 'POST') {
    $body = get_json_body();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if ($email === '' || $password === '') {
        send_json(['error' => 'E-Mail und Passwort sind erforderlich.'], 400);
    }

    $pdo = db();
    $stmt = $pdo->prepare('SELECT id, email, name, password_hash, favorite_team FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        send_json(['error' => 'Anmeldung fehlgeschlagen.'], 401);
    }

    persist_session((int) $user['id']);
    send_json(['user' => [
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'favorite_team' => $user['favorite_team'] ?? '',
    ]]);
}

if ($path === '/auth/logout' && $method === 'POST') {
    $token = $_COOKIE['session_token'] ?? null;
    if ($token !== null) {
        $pdo = db();
        $stmt = $pdo->prepare('DELETE FROM sessions WHERE token_hash = :token_hash');
        $stmt->execute(['token_hash' => hash_token($token)]);
        setcookie('session_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
        ]);
    }
    send_json(['success' => true]);
}

if ($path === '/auth/me' && $method === 'GET') {
    $user = require_auth();
    unset($user['session_id']);
    send_json(['user' => $user]);
}

if ($path === '/auth/profile' && $method === 'PUT') {
    $user = require_auth();
    $body = get_json_body();
    $name = isset($body['name']) ? trim((string) $body['name']) : $user['name'];
    $favorite = isset($body['favorite_team']) ? (string) $body['favorite_team'] : ($body['favorite'] ?? $user['favorite_team']);

    $pdo = db();
    $stmt = $pdo->prepare('UPDATE users SET name = :name, favorite_team = :favorite_team WHERE id = :id');
    $stmt->execute([
        'name' => $name,
        'favorite_team' => $favorite,
        'id' => $user['id'],
    ]);

    $user['name'] = $name;
    $user['favorite_team'] = $favorite;
    unset($user['session_id']);
    send_json(['user' => $user]);
}

if ($path === '/games' && $method === 'GET') {
    require_auth();
    $pdo = db();
    $stmt = $pdo->query('SELECT id, home_team, away_team, game_time, season FROM games ORDER BY game_time ASC');
    send_json(['games' => $stmt->fetchAll()]);
}

if ($path === '/tips' && $method === 'GET') {
    $user = require_auth();
    $pdo = db();
    $stmt = $pdo->prepare('SELECT id, user_id, season, game_id, predicted_winner, payload, created_at, updated_at FROM tips WHERE user_id = :user_id ORDER BY updated_at DESC');
    $stmt->execute(['user_id' => $user['id']]);
    $tips = [];
    foreach ($stmt->fetchAll() as $row) {
        $row['payload'] = $row['payload'] ? json_decode($row['payload'], true) : null;
        $tips[] = $row;
    }
    send_json(['tips' => $tips]);
}

if ($path === '/tips' && $method === 'POST') {
    $user = require_auth();
    $body = get_json_body();
    $normalized = normalize_tip_payload($body['payload'] ?? $body);

    $season = $body['season'] ?? $normalized['season'] ?? '';
    if ($season === '') {
        send_json(['error' => 'Season ist erforderlich.'], 400);
    }

    $gameId = array_key_exists('gameId', $body) ? $body['gameId'] : null;
    $predictedWinner = $body['predictedWinner'] ?? null;
    $payloadString = $normalized['predictions'] ? json_encode($normalized['predictions']) : null;

    $pdo = db();
    $existing = $pdo->prepare('SELECT id FROM tips WHERE user_id = :user_id AND season = :season AND (game_id <=> :game_id)');
    $existing->execute([
        'user_id' => $user['id'],
        'season' => $season,
        'game_id' => $gameId,
    ]);
    $found = $existing->fetch();

    if ($found) {
        $update = $pdo->prepare('UPDATE tips SET predicted_winner = :predicted_winner, payload = :payload, updated_at = UTC_TIMESTAMP() WHERE id = :id');
        $update->execute([
            'predicted_winner' => $predictedWinner,
            'payload' => $payloadString,
            'id' => $found['id'],
        ]);
        send_json(['id' => (int) $found['id'], 'season' => $season, 'gameId' => $gameId, 'predictedWinner' => $predictedWinner, 'payload' => $normalized['predictions']]);
    }

    $insert = $pdo->prepare('INSERT INTO tips (user_id, season, game_id, predicted_winner, payload) VALUES (:user_id, :season, :game_id, :predicted_winner, :payload)');
    $insert->execute([
        'user_id' => $user['id'],
        'season' => $season,
        'game_id' => $gameId,
        'predicted_winner' => $predictedWinner,
        'payload' => $payloadString,
    ]);

    send_json(['id' => (int) $pdo->lastInsertId(), 'season' => $season, 'gameId' => $gameId, 'predictedWinner' => $predictedWinner, 'payload' => $normalized['predictions']], 201);
}

if (preg_match('#^/tips/(\d+)$#', $path, $matches) && $method === 'PUT') {
    $user = require_auth();
    $tipId = (int) $matches[1];
    $body = get_json_body();
    $predictedWinner = $body['predictedWinner'] ?? null;
    $payload = $body['payload'] ?? null;
    $payloadString = $payload !== null ? json_encode($payload) : null;

    $pdo = db();
    $stmt = $pdo->prepare('SELECT id FROM tips WHERE id = :id AND user_id = :user_id');
    $stmt->execute(['id' => $tipId, 'user_id' => $user['id']]);
    if (!$stmt->fetch()) {
        send_json(['error' => 'Tipp nicht gefunden.'], 404);
    }

    $update = $pdo->prepare('UPDATE tips SET predicted_winner = :predicted_winner, payload = :payload, updated_at = UTC_TIMESTAMP() WHERE id = :id');
    $update->execute([
        'predicted_winner' => $predictedWinner,
        'payload' => $payloadString,
        'id' => $tipId,
    ]);

    send_json(['success' => true]);
}

send_json(['error' => 'Route nicht gefunden'], 404);
