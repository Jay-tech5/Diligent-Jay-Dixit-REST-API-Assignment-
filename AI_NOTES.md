

## 1. AI-Generated vs. Human-Written Code

| Component | AI Contribution | Human Contribution |
| :-------- | :-------------- | :----------------- |
| **Project Structure** | Suggested the initial Express.js folder structure (`controllers`, `models`, `routes`, `utils`, `data`, and `tests`). | Set up the project using the suggested structure and implemented all application files and logic. |
| **Code Review** | Reviewed the implementation and suggested improvements, bug fixes, and best practices. | Evaluated the suggestions, applied the necessary changes, fixed bugs, tested the application, and finalized the implementation. |


## 2. What I Reviewed

### Functional Review
I verified that all API features worked correctly by testing different scenarios:

- **POST /expenses** – Confirmed that new expenses could be added successfully and validated invalid input.
- **GET /expenses** – Verified that all expense records were returned correctly.
- **PUT /expenses/:id** – Checked that existing expenses could be updated and invalid update requests were handled properly.
- **DELETE /expenses/:id** – Verified that expenses were deleted correctly and appropriate errors were returned for non-existent IDs.
- **Filtering** – Tested filtering expenses by category.
- **Summary** – Verified that the total expense calculation returned accurate results.

### Bug Review
During testing, I manually reviewed and fixed issues such as:

- Creating new expense records from the browser console using `fetch()`.
- Input validation for missing or invalid fields.
- Invalid amount values (including non-finite numbers).
- Empty update request validation.
- Added try...catch blocks to manage unexpected errors during request processing.
- Consistent HTTP status codes and error responses.


### Code Review
I also reviewed the project structure and code quality by checking:

- Clear separation of routes, controllers, utilities, and data files.
- Code readability and maintainability.
- Removal of unnecessary or duplicate logic.
- Reusable validation functions.
- Consistent naming conventions and formatting.

### Testing Performed
To verify the implementation, I tested the API using:

- Browser Developer Console (`fetch()` requests)
- Terminal commands (`curl`)
- Automated tests with Jest and Supertest

## 3. AI Suggestions Not Implemented

Some AI suggestions were not used because they were outside the assignment requirements:

- Database integration
- User authentication
- External validation libraries
- Deployment configuration
- Advanced logging features
