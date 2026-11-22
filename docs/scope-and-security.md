# Scope and security boundary

This repository is a public test harness, not the WASEL application.

## What belongs here
- Synthetic fixtures with invented identifiers and values.
- Generic contract examples and dependency-free validation tests.
- Public documentation with no credentials or private implementation details.

## What must never be published here
- The private WASEL application source or database migrations.
- API tokens, passwords, signing keys, connection strings, or environment files.
- Real customer, merchant, driver, order, location, or payment data.
- Payment receipts, identity documents, phone numbers, or private business rules.

## What these tests prove
The tests validate only the synthetic fixture and a pure example contract validator in this repository. They cover malformed quantities and prices, invalid fees, total mismatches, market/currency mismatches, unsupported statuses, empty items, missing snapshots/references, and public-fixture idempotency-key labeling.

They do **not** execute, inspect, or certify the private WASEL application. They also do not prove runtime idempotency across multiple requests, live catalog-price consistency, cancellation side effects, concurrency/race safety, database transactions, payment correctness, authorization, or delivery workflows. Those require separate tests against an authorized implementation or controlled test environment.

## Integration boundary
Do not connect this public workflow to the private repository using secrets or privileged tokens. Any future integration must be reviewed separately, use least privilege, and avoid exposing private source or production data.

## Current status
No deployment, production database, external service, or secret is used by this repository.
