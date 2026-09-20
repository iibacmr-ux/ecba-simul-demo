<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/lib/rosine-coach-v2.php';
$body=json_decode(file_get_contents('php://input'),true) ?: [];
$bank=(string)($body['bank'] ?? ''); $qid=(string)($body['question_id'] ?? '');
$action=(string)($body['action'] ?? 'next_hint'); $state=is_array($body['learner_state'] ?? null)?$body['learner_state']:[];
$entry=rosine_coach_v2_entry($bank,$qid);
if(!$entry){http_response_code(404);echo json_encode(['ok'=>false,'error'=>'coach_entry_not_found']);exit;}
$authority=rosine_coach_v22_authority_status($entry);
if($action==='offer_help'){
  $elapsed=(int)($state['elapsed_seconds'] ?? 0);$offered=(int)($state['help_offer_count'] ?? 0);
  if($elapsed >= (int)($entry['trigger_after_seconds'] ?? 60) && $offered<1 && empty($state['answer_submitted'])){
    echo json_encode(['ok'=>true,'type'=>'help_offer','message'=>$entry['offer_help_text_fr'] ?? 'Tu veux un indice ?','reveal_answer'=>false,'engine_version'=>'2.2','authority'=>$authority],JSON_UNESCAPED_UNICODE);exit;
  }
  echo json_encode(['ok'=>true,'type'=>'none','reveal_answer'=>false,'engine_version'=>'2.2','authority'=>$authority],JSON_UNESCAPED_UNICODE);exit;
}
if($action==='after_answer'){
  if(empty($state['answer_submitted'])){http_response_code(403);echo json_encode(['ok'=>false,'error'=>'answer_not_submitted']);exit;}
  $ref=(($authority['authority_status'] ?? '')==='verified_task_grounding')?rosine_coach_v22_reference($entry):[];
  echo json_encode(['ok'=>true,'type'=>'debrief','debrief'=>$entry['post_answer_debrief'] ?? [],'reference'=>$ref,'authority'=>$authority,'engine_version'=>'2.2','reveal_answer'=>true],JSON_UNESCAPED_UNICODE);exit;
}
$r=rosine_coach_v2_next_hint($entry,$state);$r['ok']=true;$r['engine_version']='2.2';echo json_encode($r,JSON_UNESCAPED_UNICODE);
?>