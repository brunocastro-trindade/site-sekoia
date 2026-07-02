<?php
/**
 * Proxy de envio de leads: recebe o formulário da marca (mesmo domínio) e
 * repassa para o Namtab servidor-a-servidor (sem esbarrar em CORS).
 *
 * Fluxo: form (site) --POST JSON--> submit.php --> Namtab submit-form-data
 *
 * Robusto: usa cURL se disponível, senão file_get_contents; sempre responde JSON.
 * Auto-teste: acesse /submit.php no navegador (GET) para confirmar que o PHP roda.
 */

// Debug temporário: transforma página em branco (erro fatal) em mensagem legível.
// Remover depois de validar o envio em produção.
ini_set('display_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

const NAMTAB_ENDPOINT = 'https://qbdofrofxcnkcfhyroot.supabase.co/functions/v1/submit-form-data';
const AGENCIA_ID = 149;

/** POST JSON com cURL (se houver) ou file_get_contents. Retorna [http_code, body]. */
function post_json(string $url, string $body): array {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 20,
        ]);
        $resp = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($resp !== false && $code > 0) {
            return [$code, $resp];
        }
    }
    // Fallback sem cURL
    $ctx = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => "Content-Type: application/json\r\n",
        'content'       => $body,
        'timeout'       => 20,
        'ignore_errors' => true,
    ]]);
    $resp = @file_get_contents($url, false, $ctx);
    $code = 0;
    if (!empty($http_response_header[0]) && preg_match('#\s(\d{3})\s#', $http_response_header[0], $m)) {
        $code = (int) $m[1];
    }
    return [$code, $resp === false ? '' : $resp];
}

// Auto-teste: GET mostra que o PHP está ativo e o que está disponível.
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    echo json_encode([
        'ok'             => true,
        'message'        => 'submit.php ativo',
        'php'            => PHP_VERSION,
        'curl'           => function_exists('curl_init'),
        'allow_url_fopen' => (bool) ini_get('allow_url_fopen'),
    ]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) {
    http_response_code(400);
    echo json_encode(['error' => 'Requisição inválida.']);
    exit;
}

// Anti-spam: honeypot preenchido = descarta silenciosamente.
if (!empty($in['website_hp'])) {
    echo json_encode(['success' => true]);
    exit;
}

$nome  = trim($in['nome'] ?? '');
$email = trim($in['email'] ?? '');
if ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Preencha o nome e um e-mail válido.']);
    exit;
}

$map = [
    [1326, 'Nome',                    $nome],
    [1327, 'Cargo',                   trim($in['cargo']        ?? '')],
    [1328, 'Email',                   $email],
    [1329, 'Telefone',                trim($in['telefone']     ?? '')],
    [1330, 'Empresa',                 trim($in['empresa']      ?? '')],
    [1331, 'Tipo',                    trim($in['tipo']         ?? '')],
    [1332, 'Como podemos te ajudar?', trim($in['ajuda']        ?? '')],
    [1333, 'Investimento',            trim($in['investimento'] ?? '')],
];
$campos = [];
foreach ($map as $c) {
    $campos[] = ['id' => $c[0], 'nome' => $c[1], 'valor' => $c[2], 'campo_extra' => false];
}

$payload = json_encode(['agencia_id' => AGENCIA_ID, 'campos' => $campos]);
[$code, $resp] = post_json(NAMTAB_ENDPOINT, $payload);

$body = json_decode($resp, true);
if ($code >= 200 && $code < 300 && is_array($body) && !empty($body['success'])) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(502);
    echo json_encode([
        'error'        => 'Não foi possível enviar agora. Tente novamente.',
        'namtab_status' => $code,
    ]);
}
