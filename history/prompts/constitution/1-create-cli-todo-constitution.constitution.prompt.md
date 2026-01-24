---
id: 1
title: Update Todo Web App Constitution
stage: constitution
date: 2026-01-13
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: main
user: Claude Code
command: sp.constitution
labels: [constitution, spec-driven-development, nextjs, typescript, postgresql, prisma]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - none
---

## Prompt

The system shall build a production-ready Todo Web Application using

Next.js 16 App Router with React 19 and TypeScript 5.9.



The system must:

- Use Neon PostgreSQL for persistence

- Use Prisma 7.2 ORM

- Use custom JWT authentication

- Support multi-user accounts

- Provide full CRUD for todos

- Use server components, server actions, and route handlers correctly

- Enforce strict data isolation per user

- Be secure, scalable, and SEO-friendly

## Response snapshot

Updated the project constitution for the Todo Web Application with 6 core principles:
1. User-Centric Design
2. Type Safety & Strict Validation
3. Test-Driven Development (NON-NEGOTIABLE)
4. Zero-Trust Data Isolation
5. Performance-First Architecture
6. Progressive Enhancement

Plus technology stack requirements, security & privacy standards, development workflow, and governance sections. Also updated dependent templates to align with the constitution.

## Outcome

- ✅ Impact: Updated project constitution with all required principles aligned to Next.js/TypeScript/PostgreSQL/Prisma stack
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md and template files to maintain consistency
- 🔁 Next prompts: Plan and implement Todo web app features based on updated constitution
- 🧠 Reflection: Constitution and templates now consistently aligned with specified tech stack and security requirements

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin spec creation for Todo web application