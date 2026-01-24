"""Data models for the CLI Todo application."""
from datetime import datetime
from enum import Enum
from typing import Optional
import uuid


class TaskStatus(Enum):
    """Enumeration for task statuses."""
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class Priority(Enum):
    """Enumeration for task priorities."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task:
    """Represents a todo task with all required attributes."""

    def __init__(
        self,
        title: str,
        description: Optional[str] = None,
        status: TaskStatus = TaskStatus.PENDING,
        priority: Priority = Priority.MEDIUM,
        due_date: Optional[datetime] = None,
        task_id: Optional[str] = None
    ):
        """Initialize a Task object with validation."""
        # Validate title
        if not title or len(title.strip()) == 0:
            raise ValueError("Task title is required")
        if len(title) > 200:
            raise ValueError("Task title must be 200 characters or less")

        # Validate description if provided
        if description and len(description) > 1000:
            raise ValueError("Task description must be 1000 characters or less")

        # Set the ID (generate if not provided)
        self.id = task_id or str(uuid.uuid4())

        # Set other attributes
        self.title = title.strip()
        self.description = description.strip() if description else None
        self.status = status
        self.priority = priority
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.completed_at: Optional[datetime] = None
        self.due_date = due_date

        # Set completed_at if status is completed
        if status == TaskStatus.COMPLETED:
            self.completed_at = datetime.now()

    def mark_completed(self):
        """Mark the task as completed and update timestamps."""
        self.status = TaskStatus.COMPLETED
        self.completed_at = datetime.now()
        self.updated_at = datetime.now()

    def mark_incomplete(self):
        """Mark the task as incomplete and update timestamps."""
        self.status = TaskStatus.PENDING
        self.completed_at = None
        self.updated_at = datetime.now()

    def update(
        self,
        title: Optional[str] = None,
        description: Optional[str] = None,
        status: Optional[TaskStatus] = None,
        priority: Optional[Priority] = None,
        due_date: Optional[datetime] = None
    ):
        """Update task attributes with validation."""
        if title is not None:
            if not title or len(title.strip()) == 0:
                raise ValueError("Task title is required")
            if len(title) > 200:
                raise ValueError("Task title must be 200 characters or less")
            self.title = title.strip()

        if description is not None:
            if len(description) > 1000:
                raise ValueError("Task description must be 1000 characters or less")
            self.description = description.strip() if description else None

        if status is not None:
            self.status = status
            if status == TaskStatus.COMPLETED and self.completed_at is None:
                self.completed_at = datetime.now()
            elif status != TaskStatus.COMPLETED:
                self.completed_at = None

        if priority is not None:
            self.priority = priority

        if due_date is not None:
            self.due_date = due_date

        self.updated_at = datetime.now()

    def to_dict(self) -> dict:
        """Convert task to dictionary representation."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status.value,
            'priority': self.priority.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'due_date': self.due_date.isoformat() if self.due_date else None
        }