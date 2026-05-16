# API Flow

This document describes REST endpoints, authentication requirements, request/response shapes, and primary user journeys as implemented in the current codebase.

**Base URL:** `http://localhost:8080`  
**API prefix:** `/api`  
**Response envelope (most endpoints):**

```json
{
  "success": true,
  "data": { },
  "message": "Human-readable status message"
}
```

Invalid JWT (filter layer) returns HTTP 401:

```json
{
  "success": false,
  "data": null,
  "message": "Invalid or expired token"
}
```

---

## Authentication Header

Protected endpoints require:

```
Authorization: Bearer <jwt_token>
```

Token is obtained from `POST /api/auth/login`. Claims: `sub` = email, `role` = `LEARNER` | `MENTOR` | `ADMIN`.

---

## Endpoint Reference

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Create user (default role: LEARNER) |
| POST | `/login` | Public | Authenticate; returns JWT + user info |
| GET | `/test` | Public* | Plain text `"Hello JWT"` (not wrapped) |
| GET | `/me` | Authenticated | Current user id, email, roles |

**Register body (`RegisterRequest`):**

```json
{
  "userName": "string",
  "email": "string",
  "password": "string"
}
```

**Login body (`LoginRequest`):**

```json
{
  "email": "string",
  "password": "string"
}
```

**Login response data (`LoginResponse`):**

```json
{
  "userId": 1,
  "userName": "string",
  "email": "string",
  "role": "LEARNER",
  "token": "eyJ..."
}
```

---

### User (test) — `/api/user`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/me` | `ROLE_LEARNER` | Same purpose as `/api/auth/me` |

---

### Practice — `/api/user/practice`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/history` | `ROLE_LEARNER` | List practice sessions for current user |
| GET | `/session/{sessionId}` | `ROLE_LEARNER` | Session detail with Q&A and feedback |
| POST | `/start` | — | **Commented out** in `PracticeController` |

**History item (`PracticeHistoryResponse`):** `sessionId`, `topicName`, `score`, `time`

---

### Assessment — `/api/user/assessment`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/start` | `ROLE_LEARNER` | Create assessment session; returns `sessionId` (integer in `data`) |
| POST | `/commit` | `ROLE_LEARNER` | Finalize assessment; aggregate scores from stored feedback |
| GET | `/history` | `ROLE_LEARNER` | User's past assessments |
| GET | `/{id}` | `ROLE_LEARNER` | Assessment detail with per-question results |

**Commit body (`CommitAssessmentRequest`):**

```json
{
  "sessionId": 1,
  "answers": [
    { "questionId": 1, "answer": "user transcript or text" }
  ]
}
```

> **Note:** `answers` is defined in the DTO but **not processed** by `AssessmentServiceImpl.commitAssessment` today. Commit only reads `PracticeAnswer` + `Feedback` already in the database.

**Level assignment (on commit):**

| Total score (sum of per-question feedback) | `levelAssigned` |
|---------------------------------------------|-----------------|
| ≥ 80 | `ADVANCED` |
| ≥ 50 | `INTERMEDIATE` |
| < 50 | `BEGINNER` |

---

### Topics — `/api/topics`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Authenticated | All topics |
| GET | `/{topicId}` | Authenticated | Topic by id |
| GET | `/{topicId}/questions` | Authenticated | Questions for topic |
| GET | `/search?topicName=` | Authenticated | Topic by name |
| POST | `/` | Authenticated | Create topic |
| PUT | `/{topicId}` | Authenticated | Update topic |
| DELETE | `/{topicId}` | Authenticated | Delete topic |

**Topic response (`TopicResponse`):** `topicId`, `topicName`, `description`, `difficultyLevel`

**Question response (`QuestionResponse`):** `questionId`, `description`, `difficultyLevel`, `topicId`, `topicName`, `createdDate`

---

### Questions — `/api/questions`

> Controller mapping is `api/questions` (resolves to `/api/questions` in Spring).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Authenticated | All questions |
| GET | `/search?description=` | Authenticated | Search by description |
| GET | `/{questionId}` | Authenticated | Question by id |
| POST | `/` | Authenticated | Create question |
| PUT | `/{questionId}` | Authenticated | Update question |
| DELETE | `/{questionId}` | Authenticated | Delete question |

---

### Profile — `/api/profile`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/create` | Authenticated | Create profile (201) |
| GET | `/{id}` | Authenticated | Get profile by profile id |
| PUT | `/{id}` | Authenticated | Update profile |

---

### Users (admin-style) — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Authenticated | List all users |
| GET | `/{email}` | Authenticated | User by email |
| PATCH | `/{userId}/status` | Authenticated | Toggle ACTIVE / DISABLE |

---

### Admin — `/api/admin/**`

Configured in `SecurityConfig` to require `ROLE_ADMIN`. **No controller implementations** exist yet.

---

## Flow Diagrams

### Registration and login

```
Client                    AuthController              AuthServiceImpl
  |                              |                            |
  |-- POST /api/auth/register -->|                            |
  |                              |-- register() ------------->|
  |                              |                            |-- save User (BCrypt)
  |                              |                            |-- assign LEARNER role
  |<-- ApiResponse RegisterResponse --------------------------|
  |                              |                            |
  |-- POST /api/auth/login ----->|                            |
  |                              |-- login() ----------------->|
  |                              |                            |-- validate password
  |                              |                            |-- JwtUtil.generateToken
  |<-- ApiResponse LoginResponse (token, role) --------------|
```

### Authenticated request

```
Client          JwtAuthFilter           Controller           Service
  |                  |                      |                  |
  |-- Bearer JWT --->|                      |                  |
  |                  |-- validateToken      |                  |
  |                  |-- load User by email |                  |
  |                  |-- set UserPrincipal  |                  |
  |                  |--------------------->|                  |
  |                  |                      |-- business ----->|
  |<-- ApiResponse -------------------------|                  |
```

### Assessment (as implemented)

```
Client                 AssessmentController        AssessmentServiceImpl
  |                              |                            |
  |-- POST .../start ----------->|                            |
  |                              |-- startAssessment() ------->|
  |                              |                            |-- PracticeSession (ASSESSMENT)
  |                              |                            |-- random Topic, 10 Questions
  |                              |                            |-- PracticeQuestion rows
  |<-- data: sessionId ----------------------------------------|
  |                              |                            |
  |     [GAP: no API to submit answers + call Gemini]         |
  |                              |                            |
  |-- POST .../commit ---------->|                            |
  |                              |-- commitAssessment() ------->|
  |                              |                            |-- sum Feedback.overallScore
  |                              |                            |-- save Assessment + level
  |<-- AssessmentResponse -------------------------------------|
```

### Intended AI evaluation (service exists, not exposed)

```
[Future] Submit answer
  --> GeminiAIService.evaluateAnswer(question, answer)
  --> persist PracticeAnswer + Feedback
  --> used by commitAssessment() aggregation
```

`GeminiAIServiceImpl` expects env `GEMINI_API_KEY`, model `gemini-flash-latest`, and returns parsed `SCORE` / `FEEDBACK` text.

---

## Frontend ↔ Backend Mapping

| Frontend (`api.jsx`) | Backend | Used by |
|----------------------|---------|---------|
| `POST /auth/login` | `AuthController` | Login |
| `POST /auth/register` | `AuthController` | Register |
| `GET /user/practice/history` | `PracticeController` | History |
| `GET /user/practice/session/:id` | `PracticeController` | SessionDetail |
| `GET /topics` | `TopicController` | Speaking, Admin |
| `GET /topics/:id/sentences` | — | **Mismatch:** backend uses `/questions` |
| `GET/POST/PUT/DELETE /topics/*` | `TopicController` | ManageTopics |
| `GET/POST/PUT/DELETE /questions/*` | `QuestionController` | ManageQuestions |
| `GET/PATCH /users/*` | `UserController` | ManageUsers |
| — | `/api/user/assessment/*` | **Not called** from frontend |

---

## HTTP Status Codes (via GlobalExceptionHandler)

| Exception | Status |
|-----------|--------|
| Validation errors | 400 |
| Invalid credentials | 401 |
| Invalid token (filter) | 401 |
| Forbidden | 403 |
| Not found (various) | 404 |
| Email already exists | 409 |
| User disabled | 403 |

---

## Related Documentation

- [architecture.md](./architecture.md) — System layers and stack
- [business-domain.md](./business-domain.md) — Assessment and practice rules
- [frontend-structure.md](./frontend-structure.md) — Client API usage
