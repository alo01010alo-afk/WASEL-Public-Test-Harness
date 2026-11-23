# WASEL-BIBLE.md

> Public-safe project compass. This document contains product direction and engineering rules only; it is not a deployment guide and contains no secrets or private operating data.

## 1. What WASEL is

WASEL is a practical local-services platform being developed with an initial focus on merchants, restaurants, customers, and drivers. The broader product direction may include customer rides and a medium-transport driver-discovery service. These service lines must remain clearly separated in their user flows, permissions, accounting, and operational rules.

Do not reduce the product definition to food delivery alone. Do not treat proposed features as shipped features.

## 2. Repository boundaries

- **Private application repository:** `alo01010alo-afk/AnkaraDelivery` is the application source of truth. Keep application implementation, private configuration, database migrations, operational rules, and non-public planning there.
- **Public test harness:** `alo01010alo-afk/WASEL-Public-Test-Harness` contains only generic contract tests, invented fixtures, and public-safe documentation.
- Never copy private application code or real operational data into this public repository.
- A public repository is visible to everyone. Assume every committed byte can be copied permanently.

## 3. Architecture direction (not yet a production decision)

The product goal is to avoid operating a self-managed server where practical. A managed backend such as Supabase may be evaluated as a candidate; Firebase or other services are alternatives only after a documented comparison.

Before choosing or connecting a provider, verify:
- Current free-tier quotas, billing triggers, regional availability, data residency, backup/restore limits, and service terms from official documentation.
- Authentication and authorization design, row-level security (RLS), abuse/rate controls, and safe handling of privileged operations.
- Exportability and a tested recovery/migration path.
- Expected usage costs at pilot scale and at higher usage.

A managed backend is still backend infrastructure; “no private server” does not mean “no backend” or “no security responsibilities.”

### Client keys and secrets

- A provider's explicitly public client/anonymous key may be included in a client app only when the provider documents it as public and every exposed table, view, storage bucket, and function is protected by correctly tested policies.
- Never put service-role keys, database passwords, signing keys, payment secrets, or privileged tokens in a mobile app, public repository, screenshots, or client-side environment variables.
- GitHub Secrets are for CI workflows; they do not make a secret safe if a workflow prints it or embeds it into a distributable client app.
- Privileged actions must run in a trusted server-side environment or provider-managed function with least privilege. Do not let a client bypass authorization by calling the database directly.

## 4. Security and privacy rules

- Default to deny. Grant each customer, merchant, driver, and administrator only the actions required for their role.
- A merchant may access only its own authorized records; a customer may access only the records permitted for that customer; administrative access must be separately protected and audited.
- Test authorization using multiple synthetic accounts, including attempts to read or modify another user's records.
- Collect only data needed to deliver the service. Do not “record everything just in case.”
- Define purpose, access, retention, deletion, and backup rules before collecting personal or location data.
- Never publish real names, phone numbers, addresses, live locations, order histories, identity documents, payment evidence, or private merchant details.
- Do not store card data or payment credentials in WASEL unless a separately reviewed compliant payment design explicitly requires it.

## 5. Build in small, verifiable stages

1. Establish one end-to-end pilot flow with synthetic/test data.
2. Verify authentication, authorization, order state transitions, totals, and failure handling.
3. Add driver workflows and tracking only after permissions, location consent, and battery/network behavior are tested.
4. Add further service lines independently; do not mix their accounts, permissions, pricing, or settlement logic.
5. Pilot with a limited, consenting group before expanding.

Every stage must have acceptance criteria, a test plan, and a documented rollback path. A green test suite is evidence only for the cases it actually runs.

## 6. Reliability for constrained devices and networks

- Arabic-first, simple interfaces and short forms.
- Support older Android devices and weak or intermittent connections.
- Compress images, load them progressively, and avoid unnecessary background traffic.
- Provide text alternatives when maps or live location are unavailable.
- Make critical actions resilient to retries and duplicate submissions; implement real idempotency on the trusted backend, not just in UI code.
- Never claim live tracking or delivery status is real-time unless the system can prove it.

## 7. AI-assisted development rules

The founder owns product decisions; AI tools are assistants, not authorities.

For every proposed change:
1. Read the current repository state and existing project decisions first.
2. State assumptions and distinguish confirmed facts from proposals.
3. Make the smallest useful change.
4. Run relevant tests and inspect the resulting diff.
5. Report exactly what changed, what was tested, and what remains unverified.
6. Do not claim a deployment, passing CI run, security guarantee, or completed external action without direct evidence.

Never ask an AI tool to invent credentials, claim access it does not have, or bypass review. Do not merge, publish a release, alter production data, or make sensitive account/security changes without explicit approval.

## 8. GitHub Actions and free-tier discipline

- Keep this public harness dependency-free and test-only.
- Use path filters and concurrency cancellation to avoid unnecessary duplicate work.
- Do not schedule nightly jobs without a demonstrated need.
- Do not build APKs or upload artifacts from this public harness.
- Add caches only after measuring a real benefit.
- Check the account's current usage and official GitHub billing rules before introducing workflows that consume significant minutes or storage. Limits depend on plan, visibility, runner type, and current policy; never assume a quoted quota is universal.
- Concurrency cancellation can prevent some wasted in-progress work, but it does not guarantee a fixed percentage of savings.

## 9. Current public-repository status

This repository is a public, synthetic contract-test harness. Its tests do not certify the private app, a production database, payment processing, real authorization, or live delivery behavior. No production service or secret is configured here.

## 10. Decision log

Keep architecture and product decisions dated and explicit. Until a decision is reviewed and recorded as **approved**, treat it as a proposal. In particular, the single-public-app-repository and direct-client-to-database approach described in informal advice is **not approved** by this document.

---

**Safety rule:** If a proposed change requires exposing private code, real personal data, privileged credentials, or unreviewed production configuration in this public repository, stop and redesign it.
