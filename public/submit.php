<?php
/**
 * Proxy de envio de leads: recebe o formulário da marca (mesmo domínio) e
 * repassa para o Namtab servidor-a-servidor (sem esbarrar em CORS).
 *
 * Fluxo: form (site) --POST JSON--> submit.php --> Namtab submit-form-data
 * O lead cai no Namtab exatamente como pelo formulário oficial.
 */

header('Content-Type: application/json; charset=utf-8');

// Config do formulário Namtab (descoberto via get-form-data?slug=sekoia-marketing-149)
const NAMTAB_ENDPOINT = 'https://qbdofrofxcnkcfhyroot.supabase.co/functions/v1/submit-form-data';
const AGENCIA_ID = 149;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

$raw = file_get_contents('php://input');
$in = json_decode($raw, true);
if (!is_array($in)) {
    http_response_code(400);
    echo json_encode(['error' => 'Requisição inválida.']);
    exit;
}

// Anti-spam: se o honeypot veio preenchido, finge sucesso e descarta.
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

// Mapeia os campos do form -> ids do formulário no Namtab.
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

$ch = curl_init(NAMTAB_ENDPOINT);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code >= 200 && $code < 300) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(502);
    echo json_encode(['error' => 'Não foi possível enviar agora. Tente novamente.']);
}
