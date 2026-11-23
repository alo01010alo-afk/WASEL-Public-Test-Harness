# CI artifact and storage policy

## Current state

The public contract-test workflow is intentionally lightweight:
- It runs dependency-free Node.js tests only.
- It does not build an APK or other distributable package.
- It does not upload workflow artifacts.
- It does not configure a dependency or build cache.
- Its concurrency group cancels an older in-progress run for the same Git ref.

A successful test run therefore creates no retained APK/package artifact. The workflow run logs and GitHub's own run metadata are separate from uploaded workflow artifacts.

## Policy for future build workflows

Do not add APK packaging to this public test harness. The WASEL application remains in its separate private repository.

If an authorized, separately reviewed build workflow is introduced:
1. Upload an artifact only when a human or downstream release step needs to download it.
2. Use a short default retention period (proposed: 7 days) for temporary CI builds; set `retention-days` explicitly on the upload step.
3. Do not upload an APK on every ordinary test run.
4. Keep release candidates and published versions in a deliberate release process, not by retaining every CI artifact indefinitely.
5. Never automatically delete the last known-good release. Preserve release assets according to a separately approved release/rollback policy.
6. Avoid caching generated APKs. Add dependency/build caches only after measuring that they save meaningful time and do not create stale-build risks.
7. Keep secrets, signing keys, production configuration, and real user/business/order data out of this public repository.

## Quota and monitoring

GitHub's included Actions minutes, artifact storage, cache storage, and billing rules depend on repository visibility, account plan, runner type, and current GitHub policy. Do not hard-code a quota or price into the build design.

Review the account's current billing/usage page before introducing a build pipeline. Monitor artifact storage and cache separately; reducing artifact retention does not automatically clean every other storage category.

## Decision

For this repository, keep the current workflow test-only and artifact-free. Revisit packaging only when there is a real, approved need to distribute a WASEL build.
