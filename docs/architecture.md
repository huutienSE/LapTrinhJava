# Architecture Overview

English Learning App (LapTrinhJava) is a full-stack application for English speaking practice with automated feedback. The system follows a classic **three-tier architecture**: React SPA, Spring Boot REST API, and MySQL.

## System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│  React 19 + Vite 8  │  AuthContext  │  Axios  │  Web Speech API │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP (JSON) + JWT Bearer
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Spring Boot 4 API (localhost:8080)                  │
│  Controllers → Services → Repositories → JPA Entities            │
│  JwtAuthFilter │ SecurityConfig │ GlobalExceptionHandler         │
│  GeminiAIService (Google GenAI) — implemented, not wired         │
└───────────────────────────────┬─────────────────────────────────┘
                                │ JDBC
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL (aesp_database)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Repository Layout

```
LapTrinhJava/
├── backend/          # Spring Boot API (com.englishapp)
├── frontend/         # React SPA
├── database/         # SQL schema and seed scripts
└── docs/             # Project documentation (this folder)
```

## Backend Architecture

### Pattern

**Layered architecture** with clear separation:

| Layer | Package | Responsibility |
|-------|---------|----------------|
| Controller | `com.englishapp.controller` | HTTP mapping, validation, `ApiResponse` wrapping |
| Service | `com.englishapp.service` / `service.impl` | Business rules, transactions |
| Repository | `com.englishapp.repositoty` | JPA data access (note: package name typo) |
| Entity | `com.englishapp.entity` | ORM mapping to MySQL tables |
| DTO | `com.englishapp.dto.*` | Request/response contracts |
| Mapper | `com.englishapp.mapper` | MapStruct entity ↔ DTO |
| Security | `com.englishapp.security` | JWT creation, filter, `UserPrincipal` |
| Config | `com.englishapp.config` | Security filter chain, BCrypt |
| Exception | `com.englishapp.exception` | Domain errors + `@RestControllerAdvice` |
| Common | `com.englishapp.common` | Shared `ApiResponse<T>` |

### Request Lifecycle

1. Client sends HTTP request (optional `Authorization: Bearer <JWT>`).
2. `JwtAuthFilter` validates token and sets `SecurityContext` with `UserPrincipal`.
3. `SecurityConfig` enforces URL-based role rules.
4. Controller receives DTO, delegates to service.
5. Service uses repositories; Hibernate persists to MySQL.
6. Controller returns `ApiResponse` JSON.

### Entry Point

- **Class:** `com.englishapp.BackendApplication`
- **Default port:** `8080`

### Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Java 26 |
| Framework | Spring Boot 4.0.5 |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL (`mysql-connector-j`) |
| Security | Spring Security, JWT (jjwt 0.11.5), BCrypt |
| Mapping | MapStruct 1.5.5 |
| AI | Google GenAI SDK 1.0.0 (`gemini-flash-latest`) |
| Observability | Spring Actuator |

### Configuration

| Source | Purpose |
|--------|---------|
| `application.yml` | Primary config file (currently empty; populate from example) |
| `application-example.properties` | Datasource, JPA, JWT template |
| `GEMINI_API_KEY` (env) | Required for `GeminiAIServiceImpl` startup |

### Security Model

- **Stateless** sessions (no server-side session store).
- **JWT** carries `sub` (email) and `role` claim (`LEARNER`, `MENTOR`, `ADMIN`).
- Authorities: `ROLE_<roleName>` on `UserPrincipal`.
- **Public:** `POST /api/auth/login`, `POST /api/auth/register`.
- **Learner-only:** `/api/user/**` (includes practice and assessment).
- **Admin-only:** `/api/admin/**` (no controllers implemented yet).
- **Other routes:** any authenticated user.

### Cross-Cutting Concerns

- **Uniform API envelope:** `{ success, data, message }` via `ApiResponse<T>`.
- **Validation:** Jakarta Bean Validation on `@Valid` request bodies.
- **CORS:** `http://localhost:5173` allowed for frontend dev.

## Frontend Architecture

### Pattern

**Component-based SPA** with client-side routing and centralized API access.

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Pages | `src/pages/` | Route-level screens (auth, user, admin) |
| Layouts | `src/components/layouts/` | Shell with `Outlet` (user navbar, admin sidebar) |
| Components | `src/components/` | Reusable UI (Navbar, ActionButton, SearchInput) |
| Routes | `src/routes/` | Route table, guards (`PrivateRoute`, `AdminRoute`) |
| Context | `src/contexts/` | Global auth state (`AuthContext`) |
| Services | `src/services/` | Axios client and API modules |

### Entry Point

- **Bootstrap:** `src/main.jsx` → `App.jsx`
- **Router:** `src/routes/AppRoute.jsx` (exported as `AppRouter`)
- **Default port:** `5173` (Vite dev server)

### State Management

- **Authentication:** `AuthContext` + `localStorage` (`token`, `user`).
- **Page state:** React `useState` / `useEffect` per page.
- No global store (Redux/Zustand) or server-state library (React Query).

### API Communication

- Single Axios instance in `src/services/api.jsx`.
- Base URL: `http://localhost:8080/api` (hardcoded).
- Request interceptor attaches JWT; response interceptor redirects on 401/403.

See [frontend-structure.md](./frontend-structure.md) for details.

## Integration Status (Current Codebase)

| Capability | Backend | Frontend | End-to-end |
|------------|---------|----------|------------|
| Auth (login/register) | ✅ | ✅ | ✅ |
| Admin CRUD (topics, questions, users) | ✅ | ✅ | ✅ |
| Practice history read | ✅ | ✅ | Partial (needs sessions in DB) |
| Practice start / save answers | ❌ (commented) | ❌ | ❌ |
| Assessment flow | ✅ API | ❌ | ❌ |
| Gemini AI evaluation | ✅ service only | ❌ (mock score in Speaking) | ❌ |

## Related Documentation

- [api-flow.md](./api-flow.md) — Endpoints and sequence diagrams
- [business-domain.md](./business-domain.md) — Domain concepts and rules
- [database-overview.md](./database-overview.md) — Schema and relationships
- [frontend-structure.md](./frontend-structure.md) — React app layout

## Operational Notes

1. Copy `application-example.properties` values into `application.yml` (or use properties file) before running backend.
2. Set `GEMINI_API_KEY` if the application should start with AI service enabled.
3. Run MySQL with schema from `database/AESP_DATABASE.sql`.
4. Start backend (`BackendApplication`), then frontend (`npm run dev` in `frontend/`).
