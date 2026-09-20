# Rosine AI V2.2 — DELTA ONLY over V2.1

Cursor is already implementing V2.1. Apply this archive only after/alongside that work.

## Do not replace
- session_quizzes_v2_fixed.zip
- babok_exam_reference_v2_fixed.zip
- coach_registry_v2.json
- questions_index.json
- rosine-qcm-coach-v2.js

## Overwrite
- api/lib/rosine-coach-v2.php
- api/rosine-coach.php
- api/data/rosine-coach-v2/rosine_system_prompt_v2.md
- api/data/rosine-coach-v2/source_registry.json

## Add
- api/data/rosine-coach-v2/official_reference_index_v22.json
- api/data/rosine-coach-v2/business_analysis_standard_v2_index.json
- api/data/rosine-coach-v2/authority_validation_rules.json

## Behaviour changes
1. H4/H5 are rebuilt at runtime from authoritative sources.
2. Printed book pages and physical PDF pages are now distinguished.
3. Rosine no longer teaches a universal BABOK task sequence.
4. FIRST/NEXT/BEST is reasoned from context, inputs, dependencies and decision authority.
5. Standard v2 task-card names with “and Designs” are normalized as aliases of BABOK v3 tasks.
6. French glossary terms are recognized as synonyms without forcing UI wording.
7. manual_review remains manual_review.

## V2.1 registry QA that motivated this delta
- 2,244 QCM coach entries inspected.
- 1,555 entries had an H5 whose wording called a printed BABOK page a “PDF page”; V2.2 fixes that dynamically.
- 688 entries have no task_ref; Rosine must keep H1-H3 and must not invent H4/H5.
- After the V2.1 corrections, no remaining task-ref/KA/name conflict was detected in the task-grounded entries.

## Example
BABOK FR §7.1:
- printed page: 169
- physical page in the supplied French PDF: 182

BABOK EN §7.1:
- printed page: 136
- physical page in the supplied English PDF: 146

No front-end migration is required.
