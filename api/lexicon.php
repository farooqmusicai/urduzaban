<?php
/* ============================================================
   urduzaban.com — تلفظ کی لغت + درخواستوں کا server
   GET  ?action=get                    → لغت (json) — عوامی
   GET  ?action=health                 → حالت (کوئی راز نہیں)
   POST action=setkey&newkey=…         → پہلی بار چابی رکھیے (صرف جب کوئی چابی نہ ہو)
   POST action=suggest&word=…&form=…   → مہمان کی درخواست (بغیر چابی)
   POST action=suggestions&key=…       → درخواستوں کی فہرست (admin)
   POST action=resolve&key=…&word=…    → ایک درخواست ہٹائیے (admin)
   POST action=save&key=…&data=…       → لغت محفوظ (admin) + مماثل درخواستیں خود صاف
   Data: public_html/uz-data/lexicon.live.json + suggest.json  (دونوں repo سے باہر — git deploy اِنہیں نہیں چھوتا)
   ============================================================ */
header('Content-Type: application/json; charset=utf-8');
/* چابی repo میں نہیں — سرور پر الگ فائل میں: uz-data/uz-config.php
   (وہ فائل GitHub پر نہیں جاتی، اِس لیے deploy اُسے چھوتا بھی نہیں)
   نمونہ:  <?php return ['admin_key' => 'یہاں نئی لمبی چابی'];               */
/* ذخیرہ public_html سے *باہر* — Hostinger کا git deploy public_html کے اندر کی
   ہر غیر repo فائل مٹا دیتا ہے (29 اگست کو چابی اور لغت دونوں یوں ہی مٹیں)۔      */
$ROOT = dirname(__DIR__);                    /* public_html            */
$PRIV = dirname($ROOT) . '/uz-private';      /* public_html کے باہر    */
if (!is_dir($PRIV)) @mkdir($PRIV, 0700, true);
$DIR   = (is_dir($PRIV) && is_writable($PRIV)) ? $PRIV : $ROOT . '/uz-data';
$INSIDE = ($DIR !== $PRIV);
$LEX  = $DIR . '/lexicon.live.json';
$SUG  = $DIR . '/suggest.json';
$CFG  = $DIR . '/uz-config.php';
/* پرانی جگہ سے ایک بار اٹھا لیجیے (اگر بچی ہو) */
foreach ([['uz-config.php',$CFG], ['lexicon.live.json',$LEX], ['suggest.json',$SUG]] as $m) {
    $o = $ROOT . '/uz-data/' . $m[0];
    if (!is_file($m[1]) && is_file($o)) @copy($o, $m[1]);
}
$KEY = '';
if (is_file($CFG)) { $c = @include $CFG; if (is_array($c) && !empty($c['admin_key'])) $KEY = (string)$c['admin_key']; }

function bare_ur($s){ return trim(preg_replace('/[\x{064B}-\x{0655}\x{0670}\x{0640}]/u', '', $s)); }
function readj($f,$d){ if(is_file($f)){ $j=json_decode(file_get_contents($f),true); if(is_array($j)) return $j; } return $d; }
function writej($f,$j){ global $DIR; if(!is_dir($DIR)) @mkdir($DIR,0775,true);
  return file_put_contents($f, json_encode($j, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)); }

$act = $_REQUEST['action'] ?? 'get';

if ($act === 'get') {
    /* پہلی بار: پرانی lexicon.json میں کچھ ہو تو اُسے live میں اٹھا لیجیے */
    $old = $DIR . '/lexicon.json';
    if (!is_file($LEX) && is_file($old)) { $o = json_decode(file_get_contents($old), true);
        if (is_array($o) && !empty($o['speak'])) @copy($old, $LEX); }
    if (is_file($LEX)) readfile($LEX); else echo '{"speak":{},"updated":null}';
    exit;
}

if ($act === 'health') {
    /* کوئی راز نہیں — صرف حالت */
    echo json_encode([
        'ok'       => true,
        'store'    => $INSIDE ? 'public_html' : 'outside',   /* outside = deploy سے محفوظ */
        'writable' => is_writable($DIR),
        'config'   => is_file($CFG),
        'lexicon'  => is_file($LEX),
    ]);
    exit;
}

if ($act === 'setkey') {
    /* پہلی بار چابی رکھنے کے لیے — اور صرف جب کوئی چابی موجود نہ ہو۔
       ایک بار لگ جانے کے بعد یہ دروازہ ہمیشہ کے لیے بند۔                */
    if (is_file($CFG) || $KEY !== '') { http_response_code(409); echo '{"ok":false,"err":"exists"}'; exit; }
    $k = trim((string)($_POST['newkey'] ?? ''));
    if (!preg_match('/^[A-Za-z0-9_\-]{32,128}$/', $k)) { echo '{"ok":false,"err":"weak"}'; exit; }
    $php = "<?php\n/* urduzaban — انتظامی چابی۔ public_html سے باہر، اِس لیے deploy اِسے نہیں چھوتا۔ */\nreturn ['admin_key' => '" . $k . "'];\n";
    $ok = @file_put_contents($CFG, $php);
    if ($ok) @chmod($CFG, 0600);
    echo json_encode(['ok' => (bool)$ok, 'store' => $INSIDE ? 'public_html' : 'outside']);
    exit;
}

if ($act === 'suggest') {
    /* مہمان کی درخواست — چابی نہیں چاہیے؛ حد اور صفائی سخت */
    $w = bare_ur(mb_substr(trim($_POST['word'] ?? ''), 0, 60));
    $f = mb_substr(trim($_POST['form'] ?? ''), 0, 80);
    if ($w === '' || mb_strlen($w) < 2) { echo '{"ok":false,"err":"word"}'; exit; }
    $s = readj($SUG, ['items'=>[]]);
    $items = $s['items'] ?? [];
    $found = false;
    foreach ($items as &$it) {
        if (($it['w'] ?? '') === $w) { $it['n'] = ($it['n'] ?? 1) + 1; $it['t'] = date('c'); $found = true; break; }
    }
    unset($it);
    if (!$found) {
        if (count($items) >= 800) { echo '{"ok":false,"err":"full"}'; exit; }
        $items[] = ['w'=>$w, 'f'=>$f, 'n'=>1, 't'=>date('c')];
    }
    writej($SUG, ['items'=>$items]);
    echo '{"ok":true}';
    exit;
}

/* یہاں سے آگے چابی لازم — چابی سرور پر نہ ہو تو دروازہ بند (کھلا نہیں) */
if (!is_string($KEY) || strlen($KEY) < 16) {
    http_response_code(503);
    echo '{"ok":false,"err":"noconfig"}';
    exit;
}
if (!hash_equals($KEY, (string)($_POST['key'] ?? ''))) { http_response_code(403); echo '{"ok":false,"err":"key"}'; exit; }

if ($act === 'suggestions') {
    $s = readj($SUG, ['items'=>[]]);
    echo json_encode($s, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($act === 'resolve') {
    $w = bare_ur(trim($_POST['word'] ?? ''));
    $s = readj($SUG, ['items'=>[]]);
    $s['items'] = array_values(array_filter($s['items'] ?? [], fn($it) => ($it['w'] ?? '') !== $w));
    writej($SUG, $s);
    echo json_encode(['ok'=>true, 'left'=>count($s['items'])]);
    exit;
}

if ($act === 'save') {
    $j = json_decode($_POST['data'] ?? '', true);
    if (!is_array($j) || !isset($j['speak']) || !is_array($j['speak'])) { echo '{"ok":false,"err":"shape"}'; exit; }
    $out = ['speak'=>[], 'updated'=>date('c')];
    $n = 0;
    foreach ($j['speak'] as $k => $v) {
        if (is_string($k) && is_string($v) && $k !== '' && $v !== ''
            && mb_strlen($k) < 80 && mb_strlen($v) < 80 && $n < 8000) {
            $out['speak'][trim($k)] = trim($v); $n++;
        }
    }
    if (is_file($LEX)) @copy($LEX, $DIR.'/lexicon.live.prev.json');
    $ok = writej($LEX, $out);
    /* جس لفظ کی درستی لغت میں آ گئی، اس کی درخواست خود صاف */
    $s = readj($SUG, ['items'=>[]]);
    $before = count($s['items'] ?? []);
    $s['items'] = array_values(array_filter($s['items'] ?? [], fn($it) => !isset($out['speak'][$it['w'] ?? ''])));
    if (count($s['items']) !== $before) writej($SUG, $s);
    echo json_encode(['ok'=>(bool)$ok, 'count'=>$n, 'cleared'=>$before - count($s['items'])], JSON_UNESCAPED_UNICODE);
    exit;
}

echo '{"ok":false,"err":"action"}';
