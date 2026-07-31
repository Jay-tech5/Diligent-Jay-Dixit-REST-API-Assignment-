AI Notes & Architecture Documentation

## Overview
This repository follows standard MVC (Model-View-Controller) / layered architecture for Node.js Express REST APIs.

## Directory Structure Responsibilities
- `src/controllers/`: Contains request handler logic and response formatting.
- `src/data/`: Data storage, JSON mock data, or database seed files.
- `src/models/`: Data models and schema definitions.
- `src/routes/`: Route definitions mapping HTTP endpoints to controllers.
- `src/utils/`: Shared utilities, helpers, and middleware error handlers.
- `src/app.js`: Express application initialization and middleware configuration.
- `src/server.js`: Server startup script and environment setup.
- `public/`: Static files served by Express.
- `tests/`: Automated unit and integration test suites.
