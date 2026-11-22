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
The tests validate only the synthetic fixture and generic invariants in this repository. They do not execute, inspect, or certify the private WASEL application.

## Integration boundary
Do not connect this public workflow to the private repository using secrets or privileged tokens. Any future integration must be reviewed separately, use least privilege, and avoid exposing private source or production data.

## Current status
No deployment, production database, external service, or secret is used by this repository.
