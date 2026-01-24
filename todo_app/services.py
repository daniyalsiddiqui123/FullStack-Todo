"""Business logic services for the CLI Todo application."""
from typing import List, Optional, Tuple
from datetime import datetime
from .models import Task, TaskStatus, Priority
from .storage import TaskStorage


class TaskService:
    """Service class for managing task business logic."""

    def __init__(self, storage: TaskStorage):
        """Initialize the task service with storage dependency."""
        self.storage = storage

    def add_task(
        self,
        title: str,
        description: Optional[str] = None,
        priority: Priority = Priority.MEDIUM,
        due_date: Optional[datetime] = None
    ) -> Task:
        """Add a new task with validation."""
        # Validate inputs
        self._validate_task_title(title)
        if description:
            self._validate_task_description(description)
        if priority:
            self._validate_task_priority(priority.value)
        if due_date:
            self._validate_task_due_date(due_date)

        # Create and add task
        task = Task(
            title=title,
            description=description,
            priority=priority,
            due_date=due_date
        )
        self.storage.add_task(task)
        return task

    def get_all_tasks(
        self,
        status: Optional[TaskStatus] = None,
        priority: Optional[Priority] = None
    ) -> List[Task]:
        """Get all tasks with optional filtering."""
        return self.storage.filter_tasks(status=status, priority=priority)

    def get_task_by_id(self, task_id: str) -> Optional[Task]:
        """Get a single task by ID (supports partial ID matching)."""
        # First try exact match
        task = self.storage.get_task(task_id)
        if task:
            return task

        # If no exact match, try partial matching
        all_tasks = self.storage.list_all_tasks()
        matching_tasks = [task for task in all_tasks if task.id.startswith(task_id)]

        if len(matching_tasks) == 1:
            return matching_tasks[0]
        elif len(matching_tasks) > 1:
            # Multiple matches - ambiguous
            return None
        else:
            # No matches
            return None

    def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        status: Optional[TaskStatus] = None,
        priority: Optional[Priority] = None,
        due_date: Optional[datetime] = None
    ) -> Optional[Task]:
        """Update a task with validation."""
        existing_task = self.get_task_by_id(task_id)
        if not existing_task:
            return None

        # Validate inputs if provided
        if title:
            self._validate_task_title(title)
        if description:
            self._validate_task_description(description)
        if priority:
            self._validate_task_priority(priority.value)
        if due_date:
            self._validate_task_due_date(due_date)

        # Update the task
        existing_task.update(
            title=title,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date
        )
        self.storage.update_task(existing_task.id, existing_task)
        return existing_task

    def delete_task(self, task_id: str) -> bool:
        """Delete a task."""
        task = self.get_task_by_id(task_id)
        if not task:
            return False
        return self.storage.delete_task(task.id)

    def complete_task(self, task_id: str) -> Optional[Task]:
        """Mark a task as completed."""
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        task.mark_completed()
        self.storage.update_task(task.id, task)
        return task

    def uncomplete_task(self, task_id: str) -> Optional[Task]:
        """Mark a task as incomplete."""
        task = self.get_task_by_id(task_id)
        if not task:
            return None

        task.mark_incomplete()
        self.storage.update_task(task.id, task)
        return task

    def bulk_complete_tasks(self, task_ids: List[str]) -> Tuple[int, int]:
        """Mark multiple tasks as completed. Returns (success_count, failure_count)."""
        success_count = 0
        failure_count = 0

        for task_id in task_ids:
            task = self.get_task_by_id(task_id)
            if task:
                task.mark_completed()
                self.storage.update_task(task.id, task)
                success_count += 1
            else:
                failure_count += 1

        return success_count, failure_count

    def bulk_delete_tasks(self, task_ids: List[str]) -> Tuple[int, int]:
        """Delete multiple tasks. Returns (success_count, failure_count)."""
        success_count = 0
        failure_count = 0

        for task_id in task_ids:
            task = self.get_task_by_id(task_id)
            if task and self.storage.delete_task(task.id):
                success_count += 1
            else:
                failure_count += 1

        return success_count, failure_count

    def delete_completed_tasks(self) -> int:
        """Delete all completed tasks. Returns the number of deleted tasks."""
        completed_tasks = self.storage.get_completed_tasks()
        deleted_count = 0

        for task in completed_tasks:
            if self.storage.delete_task(task.id):
                deleted_count += 1

        return deleted_count

    def delete_all_tasks(self) -> bool:
        """Delete all tasks."""
        return self.storage.clear_all()

    def _validate_task_title(self, title: str) -> bool:
        """Validate task title."""
        if not title or len(title.strip()) == 0:
            raise ValueError("Task title is required")
        if len(title) > 200:
            raise ValueError("Task title must be 200 characters or less")
        if title != title.strip():
            raise ValueError("Task title cannot have leading or trailing whitespace")
        return True

    def _validate_task_description(self, description: str) -> bool:
        """Validate task description."""
        if len(description) > 1000:
            raise ValueError("Task description must be 1000 characters or less")
        return True

    def _validate_task_priority(self, priority: str) -> bool:
        """Validate task priority."""
        valid_priorities = [p.value for p in Priority]
        if priority not in valid_priorities:
            raise ValueError(f"Priority must be one of: {', '.join(valid_priorities)}")
        return True

    def _validate_task_due_date(self, due_date: datetime) -> bool:
        """Validate task due date."""
        # For now, just ensure it's a datetime object
        if not isinstance(due_date, datetime):
            raise ValueError("Due date must be a valid datetime")
        return True