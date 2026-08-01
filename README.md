# Diligent REST API Assignment – Expense Tracker API

## Overview

This project is a RESTful Expense Tracker API built with **Node.js** and **Express.js**.
It allows users to add, view, update, and delete expenses. Users can also filter expenses by category and view expense totals.
Expense data is stored in a local JSON file, and automated tests are included to verify the API.

## Technologies & Packages Used

### Production Dependencies

- express - Used to build the REST API and handle routing and middleware.
- cors - Allows requests from different origins, making it easier to connect frontend applications.
- dotenv - Loads environment variables from a .env file.
- uuid - Generates unique IDs for every expense record.


## Development Dependencies
- jest – Runs automated tests.
- supertest – Tests API endpoints.
- nodemon – Restarts the server automatically during development.

## Features

- Add a new expense
- View all expenses
- View an expense by ID
- Update an existing expense
- Delete an expense
- Filter expenses by category
- Calculate the total expense amount
- View total expenses by category
- Store data in a local JSON file
- Automated API testing

## API Endpoints

| Method | Endpoint                   | Description                             |
| ------ | -------------------------- | --------------------------------------- |
| GET    | `/`                        | Shows API information.                  |
| GET    | `/expenses`                | Gets all expenses.                      |
| GET    | `/expenses?category=Food`  | Gets expenses by category.              |
| GET    | `/expenses/:id`            | Gets an expense by ID.                  |
| POST   | `/expenses`                | Adds a new expense.                     |
| PUT    | `/expenses/:id`            | Updates an existing expense.            |
| PATCH  | `/expenses/:id`            | Updates selected fields of an expense.  |
| DELETE | `/expenses/:id`            | Deletes an expense.                     |
| GET    | `/expenses/total`          | Shows the total expense amount.         |
| GET    | `/expenses/total/category` | Shows total expenses for each category. |


## Sample Requests

### Create Expense

```json
POST /expenses

{
  "title": "Groceries",
  "amount": 2500,
  "category": "Food"
}
```

### Update Expense

```json
PATCH /expenses/:id

{
  "amount": 2800
}
```

### Get Category Totals

```http
GET /expenses/total/category
```


  ## Project Structure

src/
├── controllers/
│   └── expenseController.js
├── data/
│   └── expenses.json
├── models/
│   └── expenseModel.js
├── routes/
│   └── expenseRoutes.js
├── utils/
│   └── validation.js
├── app.js
└── server.js

tests/
├── app.test.js
├── expense.test.js
└── expenseModel.test.js

.gitignore
AI_NOTES.md
package.json
README.md

## Installation

Install the project dependencies:

```bash
npm install
```

---

## Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

---

## Run Tests

```bash
npm test
```
