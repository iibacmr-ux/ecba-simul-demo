# QA V2.2

After copying the delta over V2.1, verify:

1. A task-grounded QCM still returns H1-H3 unchanged.
2. H4 is generated dynamically and says there is no universal BABOK task order.
3. For a question grounded to 7.1, H5 returns printed p.169 / PDF p.182 in FR.
4. A QCM with no task_ref never receives an invented H4/H5.
5. A manual_review QCM remains manual_review.
6. A deliberate KA/ref mismatch suppresses H4/H5 and returns authority_conflict.
7. “Trace Requirements and Designs” normalizes to BABOK task 5.1.
8. “analyse d'affaires” and “analyse métier” are both recognized terminology aliases.
9. Existing V2.1 JS continues to work; no front-end migration is required.
