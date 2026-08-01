# Diligent REST API Assignment - Expense Tracker API

A modular, production-ready REST API built with **Node.js** and **Express**. It provides complete expense management (CRUD operations), expense category filtering, analytics aggregations, atomic file-based JSON persistence, and full test data isolation.

---

## 🚀 Installed Packages & Dependencies

### **Core Dependencies** (`dependencies`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| [`express`](https://www.npmjs.com/package/express) | `^4.19.2` | Fast, unopinionated web framework for Node.js REST API routing and middleware. |
| [`cors`](https://www.npmjs.com/package/cors) | `^2.8.5` | Enables Cross-Origin Resource Sharing (CORS) for browser clients. |
| [`dotenv`](https://www.npmjs.com/package/dotenv) | `^16.4.5` | Loads environment variables from `.env` into `process.env`. |
| [`uuid`](https://www.npmjs.com/package/uuid) | `^9.0.1` | Generates cryptographically strong unique identifiers (UUID v4) for expense records. |

### **Development & Testing Dependencies** (`devDependencies`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| [`jest`](https://www.npmjs.com/package/jest) | `^29.7.0` | Comprehensive JavaScript testing framework for running unit and integration test suites. |
| [`supertest`](https://www.npmjs.com/package/supertest) | `^6.3.4` | High-level HTTP assertion library for testing Express endpoints. |
| [`nodemon`](https://www.npmjs.com/package/nodemon) | `^3.1.0` | Development utility that automatically restarts the Node server when code changes. |

---

## ✨ Features

- **Full CRUD Operations**: Create, Read, Update (`PUT`/`PATCH`), and Delete (`DELETE`) expense items.
- **Filtering & Aggregation**: Filter by category (`GET /expenses?category=Food`), calculate total sum (`GET /expenses/total`), and aggregate totals by category (`GET /expenses/total/category`).
- **Atomic File Writes**: Prevents JSON data corruption by writing to temporary `.tmp` files before renaming atomically.
- **Concurrency Locking**: Queues state mutations sequentially (`enqueueOperation`) to prevent race conditions under simultaneous HTTP calls.
- **Automated Test Isolation**: Test suite automatically redirects storage to `expenses.test.json`, preserving your main data in `src/data/expenses.json`.
- **Flexible Schema Validation**: Validates inputs; `date` is optional and defaults to today's date (`YYYY-MM-DD`).

---

## 📡 API Endpoints

| HTTP Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API status and endpoint directory | *None* |
| `GET` | `/expenses` | Retrieve all expenses | *None* |
| `GET` | `/expenses?category=Food` | Filter expenses by category (case-insensitive) | *None* |
| `GET` | `/expenses/:id` | Get details of a single expense by ID | *None* |
| `POST` | `/expenses` | Create a new expense | `{ "title": "Coffee", "amount": 350, "category": "Food" }` |
| `PUT` / `PATCH` | `/expenses/:id` | Update an existing expense record | `{ "amount": 400, "title": "Cold Coffee" }` |
| `DELETE` | `/expenses/:id` | Delete expense record by ID | *None* |
| `GET` | `/expenses/total` | Get sum total of all expenses | *None* |
| `GET` | `/expenses/total/category` | Get expense totals grouped by category | *None* |

---

## 💡 Quick Start & Usage Examples

### Create Expense (`POST /expenses`)
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"title": "Groceries", "amount": 2500, "category": "Food"}'
```

### Update Expense (`PATCH /expenses/:id`)
```bash
curl -X PATCH http://localhost:3000/expenses/<EXPENSE_ID> \
  -H "Content-Type: application/json" \
  -d '{"amount": 2800}'
```

### Get Category Totals (`GET /expenses/total/category`)
```bash
curl http://localhost:3000/expenses/total/category
```

---

## 📁 Project Structure

```
├── src/
│   ├── controllers/    # Request handlers & response formatting (expenseController.js)
│   ├── data/           # JSON data storage (expenses.json)
│   ├── models/         # Business logic & atomic persistence queue (expenseModel.js)
│   ├── routes/         # Express endpoint definitions (expenseRoutes.js)
│   ├── utils/          # Schema & payload validation helpers (validation.js)
│   ├── app.js          # Express app config & middleware setup
│   └── server.js       # HTTP server launcher
├── tests/              # Automated unit & integration test suites
│   ├── app.test.js
│   ├── expense.test.js
│   └── expenseModel.test.js
├── .gitignore
├── AI_NOTES.md
├── package.json
└── README.md
```

---

## 🛠️ Installation & Execution

### 1. Installation
```bash
npm install
```

### 2. Running the Application
- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

### 3. Running Automated Tests
```bash
npm test
```
*For detailed test breakdown:*
```bash
npx jest --verbose
```
