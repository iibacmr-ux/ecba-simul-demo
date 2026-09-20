<?php
// Rosine QCM Coach V2.2 — authority grounding delta over V2.1.
function rosine_coach_v2_data_dir(): string { return __DIR__ . '/../data/rosine-coach-v2'; }
function rosine_coach_v2_load_json(string $name): array {
    static $cache = [];
    if (isset($cache[$name])) return $cache[$name];
    $p = rosine_coach_v2_data_dir() . '/' . $name;
    if (!is_file($p)) return [];
    $d = json_decode(file_get_contents($p), true);
    $cache[$name] = is_array($d) ? $d : [];
    return $cache[$name];
}
function rosine_coach_v2_entry(string $bank, string $questionId): ?array {
    $r = rosine_coach_v2_load_json('coach_registry_v2.json');
    return $r['questions'][$bank . '::' . $questionId] ?? null;
}
function rosine_coach_v22_task(string $ref): ?array {
    if ($ref === '') return null;
    $d = rosine_coach_v2_load_json('official_reference_index_v22.json');
    foreach (($d['tasks'] ?? []) as $t) if (($t['ref'] ?? '') === $ref) return $t;
    return null;
}
function rosine_coach_v22_authority_status(array $entry): array {
    if (($entry['runtime_status'] ?? '') === 'manual_review') return ['authority_status'=>'manual_review'];
    $bg = $entry['babok_grounding'] ?? [];
    $ref = trim((string)($bg['task_ref'] ?? ''));
    if ($ref === '') return ['authority_status'=>'no_task_ref'];
    $t = rosine_coach_v22_task($ref);
    if (!$t) return ['authority_status'=>'authority_conflict','reason'=>'unknown_task_ref'];
    $ka = (string)($bg['knowledge_area'] ?? '');
    if ($ka !== '' && !in_array($ka, [($t['knowledge_area_en'] ?? ''),($t['knowledge_area_fr'] ?? '')], true))
        return ['authority_status'=>'authority_conflict','reason'=>'knowledge_area_mismatch'];
    $aliases = $t['aliases'] ?? [];
    foreach (['task_name_en','task_name_fr'] as $f) {
        $n=(string)($bg[$f] ?? '');
        if ($n !== '' && !in_array($n,$aliases,true)) return ['authority_status'=>'authority_conflict','reason'=>$f.'_mismatch'];
    }
    return ['authority_status'=>'verified_task_grounding','task_ref'=>$ref];
}
function rosine_coach_v22_reference(array $entry): array {
    $ref=trim((string)(($entry['babok_grounding']['task_ref'] ?? '')));
    $t=rosine_coach_v22_task($ref);
    if (!$t) return [];
    return [
      'task_ref'=>$ref,'task_name_en'=>$t['name_en'] ?? null,'task_name_fr'=>$t['name_fr'] ?? null,
      'knowledge_area_en'=>$t['knowledge_area_en'] ?? null,'knowledge_area_fr'=>$t['knowledge_area_fr'] ?? null,
      'babok_en'=>$t['babok_en'] ?? [],'babok_fr'=>$t['babok_fr'] ?? [],'standard_v2'=>$t['standard_v2'] ?? []
    ];
}
function rosine_coach_v2_next_hint(array $entry, array $state): array {
    if (($entry['runtime_status'] ?? '') === 'manual_review')
        return ['type'=>'hint','stage'=>'manual_review','message'=>'Je peux t’aider à analyser les choix, mais je ne vais pas utiliser de référence BABOK forte : le mapping de cette question est encore en revue humaine.','reveal_answer'=>false,'authority'=>['authority_status'=>'manual_review']];
    $seen=$state['hints_seen'] ?? [];
    $auth=rosine_coach_v22_authority_status($entry);
    foreach (($entry['pre_answer_hint_ladder'] ?? []) as $h) {
        $id=$h['id'] ?? '';
        if (in_array($id,$seen,true)) continue;
        if (($id==='H4' || $id==='H5') && ($auth['authority_status'] ?? '')!=='verified_task_grounding')
            return ['type'=>'hint','stage'=>'authority_hold','message'=>'Continue par la demande exacte, la famille des choix et l’élimination. Je n’utilise pas de rattachement BABOK décisif tant que la référence n’est pas vérifiée.','reveal_answer'=>false,'authority'=>$auth];
        if ($id!=='H4' && $id!=='H5')
            return ['type'=>'hint','hint_id'=>$id,'stage'=>$h['stage'] ?? null,'message'=>$h['text_fr'] ?? '','requires_user_action'=>$h['requires_user_action'] ?? null,'reveal_answer'=>false,'authority'=>$auth];
        $r=rosine_coach_v22_reference($entry);
        if ($id==='H4') {
            $name=$r['task_name_fr'] ?? $r['task_name_en'] ?? '';
            $ka=$r['knowledge_area_fr'] ?? $r['knowledge_area_en'] ?? '';
            return ['type'=>'hint','hint_id'=>'H4','stage'=>'babok','message'=>"Ancrage BABOK vérifié : « {$name} » ({$r['task_ref']}) dans {$ka}. Raisonne à partir du contexte, des intrants disponibles et de l’autorité des acteurs ; n’applique pas un ordre universel des tâches BABOK.",'requires_user_action'=>'apply_task_context','reveal_answer'=>false,'authority'=>$auth,'reference'=>$r];
        }
        $pf=$r['babok_fr']['printed_page'] ?? null; $pdf=$r['babok_fr']['pdf_page_1based'] ?? null;
        return ['type'=>'hint','hint_id'=>'H5','stage'=>'reference','message'=>"Dernier indice : BABOK v3 §{$r['task_ref']} — page imprimée {$pf} (page {$pdf} du PDF FR). Je ne te donne toujours pas la réponse.",'requires_user_action'=>'review_reference','reveal_answer'=>false,'authority'=>$auth,'reference'=>$r];
    }
    return ['type'=>'hint','stage'=>'hold','message'=>'Tu as utilisé tous les indices progressifs disponibles. Fais maintenant ton meilleur choix ; je te ferai le débrief complet après ta réponse.','reveal_answer'=>false,'authority'=>$auth];
}
function rosine_coach_v2_build_llm_context(array $entry, array $state): array {
    $submitted=!empty($state['answer_submitted']);
    $auth=rosine_coach_v22_authority_status($entry);
    $ctx=['engine_version'=>'2.2','mode'=>$state['mode'] ?? 'exam','runtime_status'=>$entry['runtime_status'] ?? 'ready_v2',
      'strategy'=>$entry['strategy'] ?? null,'qualifiers'=>$entry['qualifiers'] ?? [],'authority_status'=>$auth,
      'official_reference'=>(($auth['authority_status'] ?? '')==='verified_task_grounding'?rosine_coach_v22_reference($entry):[]),
      'reasoning_rule'=>'No universal BABOK task sequence. FIRST/NEXT depends on scenario context, inputs, dependencies and authority.',
      'hints_seen'=>$state['hints_seen'] ?? [],'actions_completed'=>$state['actions_completed'] ?? [],'answer_submitted'=>$submitted,'guardrails'=>$entry['guardrails'] ?? []];
    if ($submitted) $ctx['post_answer_debrief']=$entry['post_answer_debrief'] ?? [];
    return $ctx;
}
?>