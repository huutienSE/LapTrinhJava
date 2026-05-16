# Database Overview

The application uses **MySQL** database **`aesp_database`**. Schema is defined in `database/AESP_DATABASE.sql` with seed data and stored procedures. Hibernate **`ddl-auto=update`** (from `application-example.properties`) can alter tables at runtime when the backend starts.

## Connection (example)

| Setting | Example value |
|---------|----------------|
| URL | `jdbc:mysql://localhost:3306/aesp_database` |
| Driver | `com.mysql.cj.jdbc.Driver` |
| Username / password | See `application-example.properties` |

## Entity-Relationship Diagram

```
                    ┌─────────┐
                    │  role   │
                    └────┬────┘
                         │
              ┌──────────┴──────────┐
              │     user_role       │
              └──────────┬──────────┘
                         │
┌─────────┐         ┌────┴────┐         ┌─────────┐
│  plan   │         │  user   │─────────│ profile │
└────┬────┘         └────┬────┘         └─────────┘
     │                   │
     │            ┌──────┴──────┬──────────────┐
     │            │             │              │
┌────┴─────┐  ┌───┴───┐    ┌────┴────┐   ┌─────┴─────┐
│subscription│ │ topic │    │question │   │admin_log  │
└──────────┘  └───┬───┘    └────┬────┘   └───────────┘
                  │             │
                  │      ┌──────┴──────────┐
                  │      │practice_question │
                  │      └──────┬──────────┘
                  │             │
            ┌─────┴─────────────┴─────┐
            │    practice_session      │
            └─────────────┬────────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
        ┌─────┴─────┐ ┌───┴────┐ ┌────┴─────┐
        │practice_  │ │assess- │ │ (topic   │
        │ answer    │ │ ment   │ │  link)   │
        └─────┬─────┘ └────────┘ └──────────┘
              │
        ┌─────┴─────┐
        │ feedback  │
        └───────────┘
```

## Tables

### Identity and access

#### `user`

| Column | Type | Notes |
|--------|------|-------|
| `user_id` | INT PK AI | |
| `user_name` | VARCHAR(50) | Display name |
| `password_hash` | VARCHAR(255) | BCrypt in app |
| `email` | VARCHAR(50) UNIQUE | Login identifier |
| `status` | ENUM | `ACTIVE`, `DISABLE` |
| `created_date` | DATETIME | Default CURRENT_TIMESTAMP |

**JPA entity:** `com.englishapp.entity.User` → table `user`

#### `role`

| Column | Type | Notes |
|--------|------|-------|
| `role_id` | INT PK AI | |
| `role_name` | ENUM | `LEARNER`, `MENTOR`, `ADMIN` |

**JPA entity:** `Role` — enum `RoleName`

#### `user_role`

| Column | Type | Notes |
|--------|------|-------|
| `role_id` | INT | PK (composite) |
| `user_id` | INT | PK (composite) |

Many-to-many join. **JPA:** `UserRole` with `@EmbeddedId` `UserRoleId`.

---

### Learner profile

#### `profile`

| Column | Type | Notes |
|--------|------|-------|
| `profile_id` | INT PK AI | |
| `user_id` | INT UNIQUE FK → user | One profile per user |
| `first_name`, `last_name` | VARCHAR(50) | |
| `birth_date` | DATE | |
| `level` | ENUM | BEGINNER, INTERMEDIATE, ADVANCED |
| `target_goal`, `occupation` | VARCHAR(50) | |

**JPA entity:** `Profile`

---

### Content

#### `topic`

| Column | Type | Notes |
|--------|------|-------|
| `topic_id` | INT PK AI | |
| `creator_id` | INT FK → user | |
| `topic_name` | VARCHAR(50) | |
| `description` | VARCHAR(200) | |
| `difficulty_level` | ENUM | BEGINNER, INTERMEDIATE, ADVANCED |
| `created_date` | DATETIME | |

**Indexes:** `idx_topic_creator`  
**JPA entity:** `Topic`

#### `question`

| Column | Type | Notes |
|--------|------|-------|
| `question_id` | INT PK AI | |
| `topic_id` | INT FK → topic | |
| `creator_id` | INT FK → user | |
| `description` | VARCHAR(200) | Question / prompt text |
| `difficulty_level` | ENUM | Used for assessment sampling |
| `created_date` | DATETIME | |

**Indexes:** `idx_question_topic`, `idx_question_creator`  
**JPA entity:** `Question`

---

### Practice and assessment

#### `practice_session`

| Column | Type | Notes |
|--------|------|-------|
| `session_id` | INT PK AI | |
| `user_id` | INT FK → user | |
| `topic_id` | INT FK → topic | Nullable in some flows |
| `session_type` | ENUM | `PRACTICE`, `ASSESSMENT` |
| `started_time` | DATETIME | |
| `ended_time` | DATETIME | Set on commit / end |
| `score` | INT | CHECK 0–100 in SQL |

**Indexes:** `idx_session_user`, `idx_session_topic`  
**JPA entity:** `PracticeSession` — enum `SessionType`

#### `practice_question`

| Column | Type | Notes |
|--------|------|-------|
| `session_id` | INT | PK (composite), FK → practice_session |
| `question_id` | INT | PK (composite), FK → question |

Links which questions belong to a session.  
**JPA entity:** `PracticeQuestion` — `@EmbeddedId` `PracticeQuestionId`

#### `practice_answer`

| Column | Type | Notes |
|--------|------|-------|
| `answer_id` | INT PK AI | |
| `session_id` | INT | FK with question_id → practice_question |
| `question_id` | INT | |
| `user_answer` | VARCHAR(100) | Learner response |
| `created_date` | DATETIME | |

**JPA entity:** `PracticeAnswer` — composite FK to `PracticeQuestion`

#### `feedback`

| Column | Type | Notes |
|--------|------|-------|
| `feedback_id` | INT PK AI | |
| `answer_id` | INT UNIQUE FK → practice_answer | One feedback per answer |
| `overall_score` | INT | CHECK 0–100 |
| `feedback_text` | VARCHAR(200) | AI / examiner text |
| `created_date` | DATETIME | |

**JPA entity:** `Feedback`

#### `assessment`

| Column | Type | Notes |
|--------|------|-------|
| `assessment_id` | INT PK AI | |
| `user_id` | INT FK → user | |
| `session_id` | INT UNIQUE FK → practice_session | 1:1 with session |
| `score` | INT | Sum of question scores at commit |
| `level_assigned` | ENUM | BEGINNER, INTERMEDIATE, ADVANCED |
| `taken_date` | DATETIME | |

**Index:** `idx_assessment_user`  
**JPA entity:** `Assessment`

---

### Billing (schema present, app unused)

#### `plan`

| Column | Type |
|--------|------|
| `plan_id` | INT PK AI |
| `plan_name` | ENUM: FREE, PRO, MENTOR |
| `price`, `duration_day` | INT |
| `description` | VARCHAR(200) |

**JPA entity:** `Plan`

#### `subscription`

| Column | Type |
|--------|------|
| `subscription_id` | INT PK AI |
| `user_id`, `plan_id` | FKs |
| `started_date`, `end_date` | DATE |
| `status` | ENUM: ACTIVE, NOTACTIVE |

**JPA entity:** `Subscription`

---

### Audit (schema present, app unused)

#### `admin_log`

| Column | Type |
|--------|------|
| `log_id` | INT PK AI |
| `admin_id` | FK → user |
| `action` | ENUM: ENABLE_USER, DISABLE_USER |
| `target_user_id` | INT |
| `target_type` | ENUM: USER, TOPIC, PLAN |
| `created_date` | DATETIME |

**JPA entity:** `AdminLog`

---

## Enumerations

Aligned between SQL ENUMs and `com.englishapp.entity.enums`:

| Enum class | Values |
|------------|--------|
| `RoleName` | LEARNER, MENTOR, ADMIN |
| `UserStatus` | ACTIVE, DISABLE |
| `Level` | BEGINNER, INTERMEDIATE, ADVANCED |
| `SessionType` | PRACTICE, ASSESSMENT |
| `DifficultyLevel` | BEGINNER, INTERMEDIATE, ADVANCED (topic/question) |
| `PlanName` | FREE, PRO, MENTOR |
| `SubscriptionStatus` | ACTIVE, NOTACTIVE |
| `AdminAction` / `Action` | ENABLE_USER, DISABLE_USER, … |
| `TargetType` | USER, TOPIC, PLAN |

## Key Constraints and Indexes

- **Uniqueness:** `user.email`, `profile.user_id`, `assessment.session_id`, `feedback.answer_id`
- **Composite PK:** `user_role(role_id, user_id)`, `practice_question(session_id, question_id)`
- **Cascade:** Most FKs use ON DELETE/UPDATE CASCADE for user-owned data
- **Score checks:** `practice_session.score`, `feedback.overall_score`, `assessment.score` bounded 0–100 in SQL

## Repository Layer (JPA)

All repositories live in package `com.englishapp.repositoty`:

| Repository | Entity |
|------------|--------|
| `UserRepository` | User |
| `RoleRepository` | Role |
| `UserRoleRepository` | UserRole |
| `ProfileRepository` | Profile |
| `TopicRepository` | Topic |
| `QuestionRepository` | Question |
| `PracticeSessionRepository` | PracticeSession |
| `PracticeQuestionRepository` | PracticeQuestion |
| `PracticeAnswerRepository` | PracticeAnswer |
| `AssessmentRepository` | Assessment |

Custom queries include e.g. `TopicRepository.findRandomTopic()`, `QuestionRepository.findRandomByLevel()`, `PracticeAnswerRepository.findBySessionWithDetails()`.

## Seed Data and Scripts

| File | Purpose |
|------|---------|
| `database/AESP_DATABASE.sql` | Full schema + `procedure_insert` seed (users, roles, sample content) |
| `database/procedure_user.sql` | User-related procedures |
| `database/insert file.sql` | Additional inserts |

> Seed users in SQL may use plaintext passwords in INSERT statements; the running application expects **BCrypt** for users created via `/api/auth/register`.

## Data Flow for Assessment (logical)

1. **INSERT** `practice_session` (ASSESSMENT)
2. **INSERT** multiple `practice_question` rows
3. *[Missing in app]* **INSERT** `practice_answer` + `feedback` per submission
4. **UPDATE** `practice_session` (score, ended_time)
5. **INSERT** `assessment` (level_assigned, score)

## Related Documentation

- [business-domain.md](./business-domain.md) — Rules and workflows
- [architecture.md](./architecture.md) — JPA and backend layers
- [api-flow.md](./api-flow.md) — APIs that read/write these tables
