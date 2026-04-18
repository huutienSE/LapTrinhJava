# EnglishApp Backend API Documentation

## Overview
This documentation covers the current backend API endpoints for the EnglishApp project.

- Backend framework: Spring Boot
- Base URL: `http://localhost:8080`
- Currently available endpoint group: `/api/auth`

---

## POST /api/auth/register
Create a new user account.

### Request
- Method: `POST`
- URL: `/api/auth/register`
- Headers:
  - `Content-Type: application/json`

### Request Body
```json
{
  "userName": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456"
}
```

### Validation rules
- `userName`: required
- `email`: required, must be a valid email address
- `password`: required, minimum 6 characters

### Success Response
- Status: `200 OK`
- Body: `Register success`

### Error Responses
- `400 Bad Request`
  - Returned when request validation fails.
  - Response body is a JSON object containing field errors.
  - Example:
    ```json
    {
      "email": "Invalid email",
      "password": "Password must be at least 6 characters"
    }
    ```

- `409 Conflict`
  - Returned when the email already exists.
  - Body: a plain text or string message describing the conflict.

### Notes
- The backend expects a single `userName` field. If the frontend collects `firstName` and `lastName`, combine them before sending.
- Example mapping from frontend form:
  - `firstName` + ` ` + `lastName` → `userName`

---

## CORS configuration
The backend allows requests from the frontend origin if configured with `@CrossOrigin(origins = "http://localhost:5173")` on the controller.

---

## Example curl
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"Nguyen Van A","email":"user@example.com","password":"123456"}'
```
