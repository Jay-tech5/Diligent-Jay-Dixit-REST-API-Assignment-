# AI Notes & Architecture Documentation

## Overview
This repository follows standard MVC (Model-View-Controller) / layered architecture for Node.js Express REST APIs.

## Directory Structure Responsibilities
- `src/controllers/`: Contains request handler logic and response formatting.
- `src/data/`: Data storage and JSON files (`expenses.json`).
- `src/models/`: Data models and schema definitions (`expenseModel.js`).
- `src/routes/`: Route definitions mapping HTTP endpoints to controllers (`expenseRoutes.js`).
- `src/utils/`: Shared utilities and validation helpers (`validation.js`).
- `src/app.js`: Express application initialization and middleware configuration.
- `src/server.js`: Server startup script and environment setup.
- `tests/`: Automated unit and integration test suites.
