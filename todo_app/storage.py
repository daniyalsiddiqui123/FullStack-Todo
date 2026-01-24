"""Persistent storage for the CLI Todo application."""
import json
import os
from typing import Dict, List, Optional
from .models import Task, TaskStatus, Priority


class TaskStorage:
    """Persistent storage for managing tasks with in-memory caching."""

    def __init__(self, storage_file: str = "todo_tasks.json"):
        """Initialize the storage with file persistence."""
        self.storage_file = storage_file
        self._tasks: Dict[str, Task] = {}
        self._load_from_file()

    def _load_from_file(self):
        """Load tasks from the storage file."""
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for task_data in data:
                        task = Task(
                            title=task_data['title'],
                            description=task_data.get('description'),
                            status=TaskStatus(task_data['status']),
                            priority=Priority(task_data['priority']),
                            due_date=None,  # We'll skip due_date for simplicity in this implementation
                            task_id=task_data['id']
                        )
                        # Set the timestamps from stored data
                        from datetime import datetime
                        task.created_at = datetime.fromisoformat(task_data['created_at'])
                        task.updated_at = datetime.fromisoformat(task_data['updated_at'])
                        if task_data['completed_at']:
                            task.completed_at = datetime.fromisoformat(task_data['completed_at'])
                        if task_data['due_date']:
                            task.due_date = datetime.fromisoformat(task_data['due_date'])

                        self._tasks[task.id] = task
            except (json.JSONDecodeError, KeyError, ValueError):
                # If there's an error loading the file, start fresh
                self._tasks = {}
        else:
            self._tasks = {}

    def _save_to_file(self):
        """Save tasks to the storage file."""
        data = []
        for task in self._tasks.values():
            data.append(task.to_dict())

        with open(self.storage_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

    def add_task(self, task: Task) -> bool:
        """Add a task to storage."""
        self._tasks[task.id] = task
        self._save_to_file()  # Save after adding
        return True

    def get_task(self, task_id: str) -> Optional[Task]:
        """Retrieve a task by ID."""
        return self._tasks.get(task_id)

    def update_task(self, task_id: str, updated_task: Task) -> bool:
        """Update a task in storage."""
        if task_id in self._tasks:
            self._tasks[task_id] = updated_task
            self._save_to_file()  # Save after update
            return True
        return False

    def delete_task(self, task_id: str) -> bool:
        """Delete a task from storage."""
        if task_id in self._tasks:
            del self._tasks[task_id]
            self._save_to_file()  # Save after deletion
            return True
        return False

    def list_all_tasks(self) -> List[Task]:
        """Retrieve all tasks."""
        return list(self._tasks.values())

    def filter_tasks(
        self,
        status: Optional[TaskStatus] = None,
        priority: Optional[Priority] = None
    ) -> List[Task]:
        """Filter tasks by status and/or priority."""
        tasks = list(self._tasks.values())

        if status is not None:
            tasks = [task for task in tasks if task.status == status]

        if priority is not None:
            tasks = [task for task in tasks if task.priority == priority]

        return tasks

    def clear_all(self) -> bool:
        """Clear all tasks from storage."""
        self._tasks.clear()
        self._save_to_file()  # Save after clearing
        return True

    def count_tasks(self) -> int:
        """Get the total number of tasks."""
        return len(self._tasks)

    def get_completed_tasks(self) -> List[Task]:
        """Get all completed tasks."""
        return [task for task in self._tasks.values() if task.status == TaskStatus.COMPLETED]

    def get_pending_tasks(self) -> List[Task]:
        """Get all pending tasks."""
        return [task for task in self._tasks.values() if task.status == TaskStatus.PENDING]