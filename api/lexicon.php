<?php
/* ============================================================
   urduzaban.com — تلفظ کی لغت + درخواستوں کا server
   GET  ?action=get                    → لغت (json) — عوامی
   POST action=suggest&word=…&form=…   → مہمان کی درخواست (بغیر چابی)
   POST action=suggestions&key=…       → درخواستوں کی فہرست (admin)
   POST action=resolve&key=…&word=…    → ایک درخواست ہٹائیے (admin)
   POST action=save&key=…&data=…       → لغت محفوظ (admin) + مماثل درخواستیں خود صاف
   Data: public_html/uz-data/lexicon.json + suggest.json
   ============================================================ */
header('Content-Type: application/json; charset=utf-8');
$KEY  = '0ff4938111d1613b3b80b42624335ef3769141e7fd434da9';   /* بدلنا ہو تو یہیں */
$DIR  = dirname(__DIR__) . '/uz-data';
$LEX  = $DIR . '/lexicon.json';
$SUG  = $DIR . '/suggest.json';

function bare_ur($s){ return trim(preg_replace('/[\x{064B}-\x{0655}\x{0670}\x{0640}]/u', '', $s)); }
function readj($f,$d){ if(is_file($f)){ $j=json_decode(file_get_contents($f),true); if(is_array($j)) return $j; } return $d; }
function writej($f,$j){ global $DIR; if(!is_dir($DIR)) @mkdir($DIR,0775,true);
  return file_put_contents($f, json_encode($j, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)); }

$act = $_REQUEST['action'] ?? 'get';

if ($act === 'get') {
    if (is_file($LEX)) readfile($LEX); else echo '{"speak":{},"updated":null}';
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

/* یہاں سے آگے چابی لازم */
if (($_POST['key'] ?? '') !== $KEY) { http_response_code(403); echo '{"ok":false,"err":"key"}'; exit; }

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
    if (is_file($LEX)) @copy($LEX, $DIR.'/lexicon.prev.json');
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
