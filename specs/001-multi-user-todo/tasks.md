---
description: "Task list for Multi-User Todo Web Application implementation"
---

# Tasks: Multi-User Todo Web Application

**Input**: Design documents from `/specs/001-multi-user-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.
In this case, tests will be included based on the constitution requirement for 85%+ coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in src/
- [X] T002 Initialize Next.js 16 project with React 19 and TypeScript 5.9 dependencies
- [X] T003 [P] Configure Tailwind CSS 4 with JIT compiler
- [X] T004 [P] Configure linting (ESLint) and formatting (Prettier) tools
- [X] T005 [P] Set up Jest for unit testing with 85%+ coverage configuration

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Setup Neon PostgreSQL connection and configuration in src/lib/db/
- [X] T007 Create Prisma schema with User and Todo models that enforce data isolation in prisma/schema.prisma
- [X] T008 [P] Initialize Prisma 7.2 client with proper connection management in src/lib/db/
- [X] T009 [P] Implement JWT generation & verification utilities in src/lib/auth/
- [X] T010 [P] Implement password hashing utilities using bcrypt in src/lib/auth/
- [X] T011 Setup Next.js API routing structure in src/app/api/
- [X] T012 [P] Implement HTTP-only JWT cookie utilities in src/lib/auth/
- [X] T013 Create authentication middleware with data isolation enforcement in src/middleware.ts
- [X] T014 [P] Create input validation utilities using Zod in src/lib/validators/
- [X] T015 Configure environment variables management with validation in src/lib/config/
- [X] T016 Create TypeScript type definitions for auth in src/types/auth.types.ts
- [X] T017 Create TypeScript type definitions for todos in src/types/todo.types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---
## Phase 3: User Story 1 - User Registration and Todo Management (Priority: P1) 🎯 MVP

**Goal**: Enable new users to register for an account and create/manage their personal todo list

**Independent Test**: Can be fully tested by registering a new user, creating todos, viewing, updating, and deleting them, and verifies that users can effectively manage their tasks.

### Tests for User Story 1 (Required based on constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Contract test for user registration endpoint in tests/contract/auth.test.ts
- [ ] T019 [P] [US1] Contract test for todo creation endpoint in tests/contract/todos.test.ts
- [ ] T020 [P] [US1] Integration test for user registration flow in tests/integration/auth-flow.test.ts
- [ ] T021 [P] [US1] Unit test for password hashing in tests/unit/auth.test.ts

### Implementation for User Story 1

- [X] T022 [P] [US1] Create User model/service in src/lib/db/user-service.ts
- [X] T023 [P] [US1] Create Todo model/service in src/lib/db/todo-service.ts
- [X] T024 [US1] Implement POST /api/auth/register endpoint in src/app/api/auth/register/route.ts
- [X] T025 [US1] Implement POST /api/todos endpoint in src/app/api/todos/route.ts
- [X] T026 [US1] Implement GET /api/todos endpoint in src/app/api/todos/route.ts
- [X] T027 [US1] Create registration UI component in src/components/auth/register-form.tsx
- [X] T028 [US1] Create todo dashboard UI in src/app/dashboard/page.tsx
- [X] T029 [US1] Create todo list UI component in src/components/todo/todo-list.tsx
- [X] T030 [US1] Create todo form UI component in src/components/todo/todo-form.tsx
- [X] T031 [US1] Add validation and error handling to auth endpoints
- [X] T032 [US1] Add validation and error handling to todo endpoints
- [X] T033 [US1] Implement data isolation checks in todo service methods
- [X] T034 [US1] Create basic layout and navigation in src/app/layout.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---
## Phase 4: User Story 2 - Authentication and Todo Operations (Priority: P2)

**Goal**: Enable existing users to log into their account and perform various operations on their todos including updating, marking as completed, and deleting

**Independent Test**: Can be fully tested by logging in as an existing user, performing all todo operations (update, mark complete, delete), and verifying the changes persist correctly.

### Tests for User Story 2 (Required based on constitution) ⚠️

- [ ] T035 [P] [US2] Contract test for login endpoint in tests/contract/auth.test.ts
- [ ] T036 [P] [US2] Contract test for todo update endpoint in tests/contract/todos.test.ts
- [ ] T037 [P] [US2] Contract test for todo delete endpoint in tests/contract/todos.test.ts
- [ ] T038 [P] [US2] Contract test for todo toggle endpoint in tests/contract/todos.test.ts

### Implementation for User Story 2

- [X] T039 [P] [US2] Implement POST /api/auth/login endpoint in src/app/api/auth/login/route.ts
- [X] T040 [P] [US2] Implement POST /api/auth/logout endpoint in src/app/api/auth/logout/route.ts
- [X] T041 [US2] Implement PUT /api/todos/{id} endpoint in src/app/api/todos/[id]/route.ts
- [X] T042 [US2] Implement DELETE /api/todos/{id} endpoint in src/app/api/todos/[id]/route.ts
- [X] T043 [US2] Implement PATCH /api/todos/{id}/toggle endpoint in src/app/api/todos/[id]/toggle/route.ts
- [X] T044 [US2] Create login UI component in src/components/auth/login-form.tsx
- [X] T045 [US2] Create todo edit form UI component in src/components/todo/todo-edit-form.tsx
- [X] T046 [US2] Create todo completion toggle UI in src/components/todo/todo-toggle.tsx
- [X] T047 [US2] Create todo delete UI component in src/components/todo/todo-delete.tsx
- [X] T048 [US2] Add JWT validation to authenticated endpoints
- [X] T049 [US2] Add proper error handling for unauthorized access attempts
- [X] T050 [US2] Update dashboard to support all todo operations

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---
## Phase 5: User Story 3 - Secure Data Isolation (Priority: P3)

**Goal**: Ensure users can only access their own data, with no possibility of viewing or modifying other users' todos

**Independent Test**: Can be tested by having multiple users with todos, and verifying that each user can only access their own data regardless of attempts to access others' data.

### Tests for User Story 3 (Required based on constitution) ⚠️

- [ ] T051 [P] [US3] Integration test for data isolation enforcement in tests/integration/security.test.ts
- [ ] T052 [P] [US3] Contract test for unauthorized todo access attempts in tests/contract/security.test.ts

### Implementation for User Story 3

- [X] T053 [P] [US3] Enhance authentication middleware to enforce data ownership in src/middleware.ts
- [X] T054 [US3] Add user ID validation to all todo endpoints to ensure data isolation
- [X] T055 [US3] Implement proper error responses for unauthorized access attempts (return 404 instead of 403)
- [X] T056 [US3] Add comprehensive input validation to all endpoints using Zod validators
- [X] T057 [US3] Implement rate limiting for authentication endpoints in src/lib/auth/rate-limiter.ts
- [X] T058 [US3] Add security headers to all responses in middleware
- [X] T059 [US3] Add additional security validations to prevent IDOR attacks

**Checkpoint**: All user stories should now be independently functional

---
## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T060 [P] Documentation updates in README.md
- [ ] T061 Code cleanup and refactoring of duplicated logic
- [ ] T062 Performance optimization across all API endpoints
- [ ] T063 [P] Additional unit tests to achieve 85%+ coverage in tests/unit/
- [ ] T064 Security hardening based on OWASP guidelines
- [ ] T065 Run quickstart.md validation to ensure setup works as documented
- [ ] T066 Add comprehensive error boundaries and user feedback in UI components
- [ ] T067 Implement proper loading states and error handling in UI
- [ ] T068 Add responsive design improvements to all UI components
- [ ] T069 Set up comprehensive logging for security events
- [ ] T070 Add proper TypeScript strict mode compliance across all files

---
## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---
## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
T018: Contract test for user registration endpoint in tests/contract/auth.test.ts
T019: Contract test for todo creation endpoint in tests/contract/todos.test.ts
T020: Integration test for user registration flow in tests/integration/auth-flow.test.ts
T021: Unit test for password hashing in tests/unit/auth.test.ts

# Launch all models for User Story 1 together:
T022: Create User model/service in src/lib/db/user-service.ts
T023: Create Todo model/service in src/lib/db/todo-service.ts
```

---
## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---
## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence