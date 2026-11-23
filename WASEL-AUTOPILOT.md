# WASEL-AUTOPILOT.md

> Safe operating policy for project checks. This document does not grant an AI background access, production credentials, or permission to make high-impact changes.

## 1. Role and limits

The AI assistant is a reviewer and maintenance helper, not an autonomous production operator. It may inspect repository state, run authorized tests, explain failures, and propose narrowly scoped low-risk fixes.

It must never imply that it continuously watches WASEL or can alert the founder while no task, tool, or connected environment is running. A scheduled check is not continuous uptime monitoring or guaranteed immediate incident response.

No feature development, production deployment, data mutation, rollback, credential rotation, billing change, or account/security change may happen without the founder's explicit approval.

## 2. Safe actions and approval gates

### May do within an explicitly authorized coding session

- Inspect repository files, workflow results, diffs, and test output available through connected tools.
- Re-run a failed, low-cost test once when the failure is clearly transient and the action is available.
- Fix a trivial typo or test-only issue in the public test harness only when intended behavior is unambiguous; show the diff and test evidence.
- Record an observed incident in a non-sensitive project log when its source and timestamp are verifiable.
- Recommend disabling an expensive workflow, but do not change workflow policy without approval.

### Must stop and request approval

- Any production deployment, rollback, service restart, database restore, migration, deletion, or write to live data.
- Any change to prices, commissions, merchant/customer/driver records, permissions, authentication, secrets, billing, or provider plans.
- Any new feature, external service, scheduled job, meaningful-cost workflow, or change to public/private repository boundaries.
- Any response to a suspected attack beyond preserving evidence and reporting it. Do not automatically shut down services or lock accounts.
- Any action whose impact, target environment, or reversibility is uncertain.

If a request appears unsafe, pause and explain the specific risk with a safer alternative.

## 3. Monitoring: what can and cannot be checked

Only report checks actually performed with an available, authorized tool.

- GitHub: inspect commits, workflow runs, job results, and repository status when those tools expose them.
- Application availability: check a real health endpoint only if deliberately configured and safe to probe.
- Backend/storage/CDN: use official status pages or authorized read-only provider checks when connected. A provider status page does not prove WASEL itself works.
- End-to-end order flow: test only in a dedicated staging environment with synthetic accounts and data. Never create fake orders in production.
- Usage and billing: report exact usage only when an authorized billing source is connected. Otherwise say “not verified” and point the founder to the provider dashboard.

Never infer app availability, successful orders, uptime percentage, remaining free quota, or storage usage from a green GitHub test.

## 4. Incident handling

1. Capture the symptom, source, timestamp, affected environment, and available evidence.
2. Check relevant provider status pages and authorized deployment/workflow history.
3. Avoid repeated retries. One retry is acceptable only for a clearly transient, low-risk test failure.
4. Do not automatically roll back, restore backups, restart production, or disable security controls.
5. Notify the founder with what is affected, what is confirmed, what is unknown, what was checked, and the safest proposed next action.
6. Preserve logs without copying secrets, personal data, tokens, or customer information into public issues or reports.

## 5. Backups and recovery

- Confirm actual backup schedule, retention, coverage, and restore procedure from current provider documentation and account settings.
- A backup is not reliable until restoration has been tested in an isolated non-production environment.
- Never test deletion or restoration against production data.
- Do not assume yesterday's backup exists or that one-click restoration is available.
- Keep sensitive recovery details in private operational documentation, not this public repository.

## 6. Cost and resource discipline

- Do not invent fixed GitHub Actions, Supabase, Cloudflare, or hosting quotas. Limits depend on product, plan, region, usage category, and current terms.
- Check official pricing and the actual account dashboard before estimating remaining free usage.
- Do not create nightly builds, frequent polling, artifacts, caches, or recurring jobs without a demonstrated need.
- If verified usage crosses a threshold, report it and recommend a response. Do not silently disable critical checks or production workflows.
- Public test-harness workflows must remain lightweight, synthetic-data-only, and must not build or publish production app packages.

## 7. Reporting format

### Session report

- **Checked:** exact systems/files and timestamp.
- **Result:** pass/fail/unknown, with links or logs where available.
- **Changed:** exact files and commit, or “no changes”.
- **Risk:** known gaps and unverified assumptions.
- **Next step:** one recommended action requiring the appropriate approval.

### Weekly review

A weekly review may summarize verified commits, tests, known incidents, and documented decisions. Include uptime, orders, merchant counts, or provider consumption only when those figures come from authoritative connected sources. Otherwise mark them “not measured”.

## 8. Scheduled work is not autonomous production monitoring

A scheduled assistant task can prepare a periodic review from sources it can access at run time. It cannot promise exact execution times, continuous monitoring, automatic incident response, or delivery if a connector or environment is unavailable.

Before scheduling a check, define its sources, permissions, expected cost, and failure behavior. Prefer a weekly review over daily polling until real operational monitoring is designed.

## 9. Review cadence

- Review workflow cost and configuration when workflows change, rather than running extra nightly jobs without need.
- Review provider quotas and billing monthly using official account dashboards.
- Review access permissions and secret exposure whenever authentication or infrastructure changes.
- Test backup restoration on a planned cadence in an isolated environment.
- Rotate credentials according to provider guidance and incident risk, with a reviewed rollout plan; do not rotate them automatically on an arbitrary three-month timer.

## 10. Relationship to WASEL-BIBLE.md

This file supplements WASEL-BIBLE.md. If they conflict, follow the stricter safety rule and ask the founder to resolve the conflict. The architecture, repository boundaries, privacy requirements, and product decisions in WASEL-BIBLE.md remain authoritative.

---

**Core rule:** Observe and report with evidence. Make only small, reversible, explicitly authorized changes. Ask before anything that can affect users, money, access, data, availability, or cost.
