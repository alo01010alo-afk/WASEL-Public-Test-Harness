# WASEL-Public-Test-Harness

Public, dependency-free contract examples and safe sample fixtures for WASEL.

## Purpose

This repository contains synthetic examples and generic checks only. It is deliberately separate from the private WASEL application repository.

## Current checks

The Node.js test suite validates the synthetic order contract, including:
- Market/currency pairing and supported order status.
- Positive safe-integer quantities and non-negative safe-integer prices/fees.
- Required item references and name snapshots.
- Correct order total arithmetic.
- Explicitly synthetic fixture and non-production idempotency-key labeling.
- Rejection of malformed examples such as empty items, invalid states, and tampered totals.

These are public example-contract tests, not tests of the private application or its runtime behavior.

## Run locally

Requires Node.js 20 or newer:

```sh
npm test
```

GitHub Actions runs the same checks on pushes to `main`, pull requests, and manual dispatches.

## Important limitation

A passing run validates only the synthetic fixtures and generic rules in this repository. It does **not** test or certify the private WASEL application. In particular, it cannot establish real multi-request idempotency, live pricing, cancellation side effects, concurrency safety, payment correctness, authorization, or database transaction behavior.

## Security

Never add private application source, credentials, real user/business/order data, payment evidence, or production configuration here. See [Scope and security boundary](docs/scope-and-security.md).
