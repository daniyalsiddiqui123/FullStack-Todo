---
id: 2
title: fix-todo-refresh-after-chatbot
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix todo list not refreshing after chatbot operations"
labels: ["bug-fix", "ui-refresh", "event-handling", "todo-list"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix Todo List Refresh After Chatbot Operations

## Prompt Text
User reported that todos added through the chatbot weren't showing up in the tasks list, even though the chatbot confirmed they were added successfully.

## Response Text
Identified that the TodoList component wasn't refreshing its data after chatbot operations. Fixed by:

1. Adding an event listener in TodoList component to refresh data when 'todosUpdated' event is fired
2. Using useCallback to properly manage the fetchTodos function
3. Updating the chatbot to dispatch the event with response data

The TodoList now listens for the 'todosUpdated' event dispatched by the chatbot and automatically fetches fresh data from the API, ensuring newly added todos appear in the UI immediately.

## Files Modified
- src/components/todo/todo-list.tsx
- src/components/todo/todo-chatbot.tsx

## Outcome
Todos added through the chatbot now appear immediately in the todo list without requiring a page refresh.

## Evaluation
The fix ensures proper synchronization between the chatbot and the todo list UI.