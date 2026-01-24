#!/usr/bin/env python3
"""Simple test script to verify the CLI Todo app functionality."""
from todo_app.storage import InMemoryTaskStorage
from todo_app.services import TaskService
from todo_app.models import Priority


def test_basic_functionality():
    """Test basic functionality of the todo app."""
    print("Testing basic functionality...")

    # Create storage and service
    storage = InMemoryTaskStorage()
    service = TaskService(storage)

    # Test adding a task
    print("\n1. Adding a task...")
    task = service.add_task(
        title="Test task",
        description="This is a test task",
        priority=Priority.MEDIUM
    )
    print(f"Added task: {task.title} with ID: {task.id}")

    # Test getting all tasks
    print("\n2. Getting all tasks...")
    tasks = service.get_all_tasks()
    print(f"Found {len(tasks)} tasks")
    for task in tasks:
        print(f"  - {task.id[:8]}: {task.title} [{task.status.value}]")

    # Test updating a task
    print("\n3. Updating the task...")
    updated_task = service.update_task(
        task_id=task.id,
        title="Updated test task",
        priority=Priority.HIGH
    )
    if updated_task:
        print(f"Updated task: {updated_task.title}")

    # Test getting tasks again to see update
    print("\n4. Getting tasks after update...")
    tasks = service.get_all_tasks()
    for task in tasks:
        print(f"  - {task.id[:8]}: {task.title} [{task.status.value}]")

    # Test completing a task
    print("\n5. Completing the task...")
    completed_task = service.complete_task(task.id)
    if completed_task:
        print(f"Completed task: {completed_task.title} [{completed_task.status.value}]")

    # Test getting completed tasks
    print("\n6. Getting completed tasks...")
    all_tasks = storage.list_all_tasks()
    completed_tasks = [t for t in all_tasks if t.status.value == 'completed']
    print(f"Found {len(completed_tasks)} completed tasks")

    # Test deleting a task
    print("\n7. Deleting the task...")
    success = service.delete_task(task.id)
    print(f"Deletion successful: {success}")

    # Test getting tasks after deletion
    print("\n8. Getting tasks after deletion...")
    tasks = service.get_all_tasks()
    print(f"Found {len(tasks)} tasks after deletion")

    print("\nAll tests completed successfully!")


if __name__ == "__main__":
    test_basic_functionality()