# WASEL-Public-Test-Harness

Public, dependency-free contract examples and safe validation tools for WASEL.

## Purpose

This repository contains synthetic examples and generic checks only. It is deliberately separate from the private WASEL application repository.

## Run locally

Requires Node.js 20 or newer:

```sh
npm test
```

GitHub Actions runs the same checks on pushes to `main`, pull requests, and manual dispatches.

## Important limitation

A passing run validates only the synthetic fixtures and generic rules in this repository. It does **not** test or certify the private WASEL application.

## Security

Never add private application source, credentials, real user/business/order data, payment evidence, or production configuration here. See [Scope and security boundary](docs/scope-and-security.md).
