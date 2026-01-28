---
id: 5
title: fix-infinite-loop-todolist
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix infinite API call loop in TodoList component"
labels: ["bug-fix", "performance", "event-handling"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix Infinite Loop in TodoList Component

## Prompt Text
User reported that the TodoList component was stuck in a loading state with continuous API calls (GET /api/todos in a loop).

## Response Text
Identified and fixed a potential infinite loop in the TodoList component where the event dispatched by the component was triggering its own refresh. Implemented a solution that:

1. Added a 'fromTodoList' flag to events dispatched by the TodoList component
2. Updated the event listener to ignore events originating from the TodoList itself
3. Maintained the ability to refresh from external sources like the chatbot
4. Added proper type safety for event handling

## Files Modified
- src/components/todo/todo-list.tsx

## Outcome
The infinite API call loop should be resolved while maintaining proper refresh functionality.

## Evaluation
The component should now only fetch todos on mount and when triggered by external events, not by its own state changes.