# ERC20-Faucet-Dapp

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=white) ![License](https://img.shields.io/github/license/Manirider/ERC20-Faucet-Dapp?style=flat-square) ![Last Commit](https://img.shields.io/github/last-commit/Manirider/ERC20-Faucet-Dapp?style=flat-square) ![Issues](https://img.shields.io/github/issues/Manirider/ERC20-Faucet-Dapp?style=flat-square)

`portfolio-project`

## Project Overview

A developer-focused DApp providing testnet ERC20 tokens. Built with React and Solidity, it enforces cooldown limits to prevent faucet abuse.

## Problem Statement

Traditional implementations in this domain often suffer from scalability limits, complex runtime configurations, and poor modular structure. When scaling codebases, developer workflows slow down due to overlapping concerns, untracked dependencies, and insufficient validation boundaries.

## Motivation & Objectives

This repository is designed as a template for professional codebases, focusing on:
- **Separation of Concerns:** Clear separation between ingestion pipelines, business modules, and delivery targets.
- **Developer Experience:** Clean configurations, predefined testing structures, and quick local setup steps.
- **Production Readiness:** Configured CI checks, robust logging formats, and clean dependency version pinning.

## Core Features

- Solidity token faucet contract with configurable drip amounts and cooldowns.
- React frontend showing faucet status and token balances.
- Web3 wallet integration (like MetaMask) handling transaction signatures.
- Hardhat configs deploying contracts to testnets like Sepolia.
- Comprehensive test coverage validating cooldown limits.

## Technical Flow & Execution

Users connect their wallets to the React interface and request tokens. The contract verifies the cooldown period has passed and transfers tokens to the user's address.

## Getting Started

### Requirements

- Node.js version 18 or above
- Npm or Yarn package manager

### Environment Configuration

```bash
# Clone this repository
git clone https://github.com/Manirider/ERC20-Faucet-Dapp.git
cd ERC20-Faucet-Dapp

# Install packages
npm install
```

### Execution

```bash
# Start the local development server
npm run dev

# Run target tests
npm run test
```

## Testing and Quality Assurance

We maintain code stability through automated verification routines:
- **Linting Verification:** All commits are checked against styling rules using standard code formatting checkers.
- **Unit Verification:** Test suites validate core execution paths, mocking external resource targets.
- **Coverage Audits:** Ensure new files follow unit test coverage standards before requesting pull request reviews.

Execute checks using the following commands:
- **Python Lints:** `flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics`
- **Python Tests:** `pytest tests/ --tb=short`
- **JS/TS Lints:** `npm run lint`
- **JS/TS Tests:** `npm run test`

## Troubleshooting Guide

### Common Configuration Errors

1. **Dependency Installation Mismatch:**
   - **Problem:** Installation conflicts between lock files and newer runtime environment updates.
   - **Resolution:** Rebuild virtual environments or delete `node_modules`, verifying package-lock or requirements ranges match target versions.
   
2. **Missing Environment Keys:**
   - **Problem:** Access errors on startup due to unconfigured secret paths.
   - **Resolution:** Ensure `.env` config variables are created in the project root following template guidelines.

3. **Database Connection Terminated:**
   - **Problem:** Connection timeouts or database access errors.
   - **Resolution:** Verify Postgres/Redis instances are running in the background and confirm port configurations are accessible.

## Frequently Asked Questions (FAQ)

- **How is project configuration managed?**
  Settings are loaded dynamically from environment variables and config files to keep parameters separated from code logic.
  
- **Can I run this project in a containerized environment?**
  Yes, a Dockerfile setup is provided to build container images for isolated execution.
  
- **What is the contribution review turnaround SLA?**
  Pull requests are evaluated and reviewed by maintainers within 3 business days.

## Directory Layout

```
ERC20-Faucet-Dapp/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
└── (source files)
```

## Contributing to the Project

I welcome issues and pull requests to make this project better. Please see the detailed guidelines in the [Contributing Guide](CONTRIBUTING.md).

## Project License

This repository is distributed under the MIT License. For complete terms, see the [LICENSE](LICENSE) file.

Developed by [S. Manikanta Suryasai](https://github.com/Manirider)
