# CLI Todo App

A command-line interface todo application built with Python 3.13+.

## Features

- Add, view, update, delete, and complete tasks
- In-memory storage (no persistence)
- Task filtering and sorting
- Priority levels (low, medium, high)
- Due dates for tasks
- Color-coded output for better visibility

## Installation

1. Make sure you have Python 3.13+ installed
2. Install dependencies: `pip install -e .`
3. The `todo` command will be available globally

## Usage

```bash
# Add a task
todo add "Buy groceries" --description "Milk, bread, eggs" --priority high

# List all tasks
todo list

# List tasks with specific status
todo list --status pending

# List tasks with specific priority
todo list --priority high

# List and sort tasks by priority
todo list --sort priority

# Show details of a specific task
todo show <task-id>

# Update a task
todo update <task-id> --title "New title" --priority high

# Mark a task as completed
todo complete <task-id>

# Mark a task as incomplete
todo uncomplete <task-id>

# Mark multiple tasks as completed
todo bulk-complete <task-id1> <task-id2> <task-id3>

# Delete a task
todo delete <task-id>

# Delete all completed tasks
todo delete-completed

# Delete all tasks (with confirmation)
todo delete-all

# Get help
todo --help
todo add --help
```

## Commands

- `add`: Add a new task
- `list`: List all tasks with optional filtering and sorting
- `show`: Show details of a specific task
- `update`: Update task details
- `complete`: Mark a task as completed
- `uncomplete`: Mark a task as incomplete
- `bulk-complete`: Mark multiple tasks as completed
- `delete`: Delete a specific task
- `delete-completed`: Delete all completed tasks
- `delete-all`: Delete all tasks (with confirmation)

## Architecture

The application follows clean architecture principles:

- **Presentation Layer**: CLI interface (`cli.py`)
- **Use Case Layer**: Business logic services (`services.py`)
- **Entity Layer**: Data models (`models.py`)
- **Framework Layer**: Storage and utilities (`storage.py`, `utils.py`)

## Development

The application was developed following the specification-driven approach with:

- Specification in `specs/todo-app/spec.md`
- Implementation plan in `specs/todo-app/plan.md`
- Task breakdown in `specs/todo-app/tasks.md`
- Project constitution in `.specify/memory/constitution.md`