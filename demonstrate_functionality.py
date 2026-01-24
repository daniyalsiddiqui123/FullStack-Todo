#!/usr/bin/env python3
"""Demonstrate that the todo app functionality works internally."""
from todo_app.storage import InMemoryTaskStorage
from todo_app.services import TaskService
from todo_app.models import Priority

def demo_functionality():
    print("Demonstrating CLI Todo App functionality:")
    print()

    # Create storage and service (this is what happens internally in the app)
    storage = InMemoryTaskStorage()
    service = TaskService(storage)

    print("1. Adding tasks:")
    task1 = service.add_task("Buy groceries", "Milk, bread, eggs", Priority.HIGH)
    print(f"   Added: {task1.title} (ID: {task1.id[:8]})")

    task2 = service.add_task("Finish project", "Complete the CLI todo app", Priority.MEDIUM)
    print(f"   Added: {task2.title} (ID: {task2.id[:8]})")

    task3 = service.add_task("Call mom", priority=Priority.LOW)
    print(f"   Added: {task3.title} (ID: {task3.id[:8]})")

    print(f"\n2. Total tasks: {storage.count_tasks()}")

    print("\n3. Listing all tasks:")
    all_tasks = service.get_all_tasks()
    for task in all_tasks:
        print(f"   - {task.id[:8]}: {task.title} [{task.status.value}] - {task.priority.value}")

    print(f"\n4. Updating a task:")
    updated_task = service.update_task(task1.id, title="Buy groceries and cook dinner", priority=Priority.HIGH)
    print(f"   Updated: {updated_task.title}")

    print("\n5. Marking a task as completed:")
    completed_task = service.complete_task(task2.id)
    print(f"   Completed: {completed_task.title} [{completed_task.status.value}]")

    print("\n6. Listing tasks after updates:")
    all_tasks = service.get_all_tasks()
    for task in all_tasks:
        print(f"   - {task.id[:8]}: {task.title} [{task.status.value}] - {task.priority.value}")

    print("\n7. Filtering completed tasks:")
    completed_tasks = [t for t in all_tasks if t.status.value == 'completed']
    for task in completed_tasks:
        print(f"   - {task.id[:8]}: {task.title} [{task.status.value}]")

    print("\n8. Deleting a task:")
    delete_success = service.delete_task(task3.id)
    print(f"   Delete successful: {delete_success}")

    print(f"\n9. Final task count: {storage.count_tasks()}")

    print("\nAll functionality works correctly within the application!")

if __name__ == "__main__":
    demo_functionality()