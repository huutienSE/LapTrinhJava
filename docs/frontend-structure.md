# Frontend Structure

The frontend is a **React 19** single-page application built with **Vite 8**, styled with **Tailwind CSS v4**, and routed with **React Router 7**.

## Quick Reference

| Item | Value |
|------|--------|
| Root | `frontend/` |
| Entry | `src/main.jsx` |
| Dev server | `http://localhost:5173` |
| API base | `http://localhost:8080/api` (Axios, hardcoded) |
| Package manager | npm |

## Directory Tree

```
frontend/
├── index.html
├── package.json
├── vite.config.js          # React + Tailwind plugins; /api proxy to :8080
├── eslint.config.js
├── public/
│   └── icons.svg
└── src/
    ├── main.jsx            # ReactDOM.createRoot
    ├── App.jsx             # AuthProvider + BrowserRouter
    ├── App.css
    ├── index.css           # @import "tailwindcss"
    ├── contexts/
    │   └── AuthContext.jsx
    ├── routes/
    │   ├── AppRoute.jsx    # Route definitions (default export: AppRouter)
    │   ├── PrivateRoute.jsx
    │   └── AdminRoute.jsx
    ├── services/
    │   ├── api.jsx         # Axios client + service modules
    │   └── mockData.jsx    # Legacy mock constants (mostly unused)
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── user/
    │   │   ├── Home.jsx
    │   │   ├── Speaking.jsx
    │   │   ├── History.jsx
    │   │   └── SessionDetail.jsx
    │   └── admin/
    │       ├── Dashboard.jsx
    │       ├── ManageTopics.jsx
    │       ├── ManageQuestions.jsx
    │       └── ManageUsers.jsx
    └── components/
        ├── Navbar.jsx
        ├── layouts/
        │   ├── UserLayout.jsx
        │   └── AdminLayout.jsx
        └── common/
            ├── ActionButton.jsx
            └── SearchInput.jsx
```

## Application Bootstrap

```
main.jsx
  └── <App />
        └── <AuthProvider>
              └── <BrowserRouter>
                    └── <AppRouter />   (from routes/AppRoute.jsx)
```

## Routing

Defined in `src/routes/AppRoute.jsx`.

### User layout (`UserLayout`)

Includes `Navbar` and `<Outlet />` for nested routes.

| Path | Guard | Component | Description |
|------|-------|-----------|-------------|
| `/` | — | `HomeRedirect` → `Home` or `/admin` | Landing page |
| `/login` | — | `Login` | Login form |
| `/register` | — | `Register` | Registration form |
| `/history` | `PrivateRoute` | `History` | Practice session list |
| `/speaking` | `PrivateRoute` | `Speaking` | Speaking practice wizard |
| `/history/:sessionId` | `PrivateRoute` | `SessionDetail` | Single session detail |

### Admin layout (`AdminLayout`)

Sidebar navigation + `<Outlet />`. Wrapped by `AdminRoute`.

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `Dashboard` | Placeholder dashboard |
| `/admin/topics` | `ManageTopics` | Topic CRUD |
| `/admin/questions` | `ManageQuestions` | Question CRUD |
| `/admin/users` | `ManageUsers` | User list and status toggle |

### Redirect logic

- **`HomeRedirect`:** If logged in as `ADMIN`, navigate to `/admin`; otherwise show `Home`.
- **`Login`:** After success, `ADMIN` → `/admin`, else `/`.
- **Fallback:** `*` → `/`.

## Route Guards

### `PrivateRoute.jsx`

- Reads `isLoggedIn` from `useAuth()`.
- If true → render `<Outlet />`.
- Else → `<Navigate to="/login" />`.

### `AdminRoute.jsx`

- Requires `isLoggedIn` and `currentUser.role === "ADMIN"`.
- Otherwise redirect to `/` or `/login`.

## Authentication (`AuthContext.jsx`)

### State

- `currentUser` — object from login response (stored in `localStorage.user`).
- `isLoggedIn` — derived from presence of token on mount.

### Methods

| Method | Behavior |
|--------|----------|
| `handleLogin(formData)` | `authService.login` → save `token` + `user` to localStorage |
| `handleLogOut()` | Clear localStorage and reset state |

### Persistence

| Key | Content |
|-----|---------|
| `localStorage.token` | JWT string |
| `localStorage.user` | JSON string of login response (`userId`, `userName`, `email`, `role`, `token`) |

On page refresh, context restores from localStorage **without** calling `/api/auth/me`.

### Hook

```javascript
import { useAuth } from "../contexts/AuthContext";
const { currentUser, isLoggedIn, handleLogin, handleLogOut } = useAuth();
```

## API Layer (`services/api.jsx`)

### Axios client

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});
```

### Interceptors

**Request:** Attach `Authorization: Bearer ${token}` when `localStorage.token` exists.

**Response:** On 401/403 (except `/auth/login`), clear auth and redirect to `/login`.

### Service modules

| Export | Methods | Backend paths |
|--------|---------|---------------|
| `authService` | `login`, `register` | `/auth/login`, `/auth/register` |
| `userService` | `getPracticeHistory`, `getPracticeHistoryDetail`, `getProfile` | `/user/practice/*`, `/user/profile`† |
| `speakingService` | `getTopics`, `getSentences` | `/topics`, `/topics/:id/sentences`‡ |
| `adminService` | topics, questions, users CRUD | `/topics/*`, `/questions/*`, `/users/*` |

† `getProfile` calls `/user/profile` but backend profile API is `/api/profile` — not used in UI today.

‡ `getSentences` path does not match backend (`/topics/:id/questions`).

### Vite proxy (unused by default)

`vite.config.js` proxies `/api` → `http://localhost:8080`. The Axios client uses a full URL, so the proxy is only useful if base URL is changed to a relative `/api`.

## Page Responsibilities

### Auth

- **`Login.jsx`** — Email/password form; calls `handleLogin`; role-based redirect.
- **`Register.jsx`** — `userName`, `email`, `password`; calls `authService.register`.

### User

- **`Home.jsx`** — Marketing landing; links to speaking/history.
- **`Speaking.jsx`** — 3-step flow: topics → questions → record.
  - Uses `react-speech-recognition` for browser STT (`en-US`).
  - **Issues:** calls `getSentencesByTopic` and `saveRecord` (not defined in `api.jsx`); uses mock score; expects mock topic shape (`id`, `title`, `icon`).
- **`History.jsx`** — `userService.getPracticeHistory()`; table of sessions.
- **`SessionDetail.jsx`** — `getPracticeHistoryDetail(sessionId)`; shows questions, answers, feedback.

### Admin

- **`ManageTopics.jsx`** — Full topic CRUD via `adminService`.
- **`ManageQuestions.jsx`** — Question CRUD; topic dropdown from `getTopics`.
- **`ManageUsers.jsx`** — List users; toggle status via PATCH.
- **`Dashboard.jsx`** — Static placeholder.

## Shared Components

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top nav; login/logout; links hidden when logged out |
| `UserLayout.jsx` | Page shell for learner routes |
| `AdminLayout.jsx` | Sidebar + outlet for admin |
| `ActionButton.jsx` | Reusable button styling |
| `SearchInput.jsx` | Debounced search input (admin tables) |

## Dependencies (`package.json`)

| Package | Role |
|---------|------|
| `react`, `react-dom` | UI |
| `react-router-dom` | Routing |
| `axios` | HTTP |
| `react-speech-recognition` | Browser speech-to-text on Speaking page |

Tailwind is loaded via `@tailwindcss/vite` in `vite.config.js` and `index.css` (dev dependency may be hoisted at repo root).

## Naming Conventions

| Artifact | Convention | Example |
|----------|------------|---------|
| Page files | PascalCase `.jsx` | `Speaking.jsx` |
| Route files | PascalCase + `Route` | `PrivateRoute.jsx` |
| Service exports | camelCase `*Service` | `authService` |
| Context | `*Context.jsx` + `use*` hook | `AuthContext`, `useAuth` |
| Folders | lowercase plural | `pages/`, `components/` |

## Known Gaps (documentation of current state)

1. **Speaking page** not aligned with `api.jsx` or backend DTO field names.
2. **Assessment APIs** not integrated in frontend.
3. **No** dedicated hooks folder; logic lives in page components.
4. **Admin users** with JWT role `ADMIN` may receive 403 on `/api/user/*` (backend requires `LEARNER`).

## Related Documentation

- [api-flow.md](./api-flow.md) — REST endpoints and sequences
- [architecture.md](./architecture.md) — Full-stack overview
- [business-domain.md](./business-domain.md) — Practice vs assessment concepts
