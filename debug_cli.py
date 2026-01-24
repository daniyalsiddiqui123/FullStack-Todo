#!/usr/bin/env python3
"""Debug script to check CLI context sharing."""
import click
from todo_app.cli import CLIContext


@click.command()
def debug_storage():
    """Debug the storage to see if tasks persist."""
    ctx_obj = CLIContext()
    print(f"Initial task count: {ctx_obj.storage.count_tasks()}")

    # Add a task directly to the storage
    from todo_app.models import Task, Priority
    test_task = Task(title="Debug task", priority=Priority.MEDIUM)
    ctx_obj.storage.add_task(test_task)

    print(f"Task count after adding: {ctx_obj.storage.count_tasks()}")
    print(f"Added task ID: {test_task.id}")

    # Try to get the task back
    retrieved_task = ctx_obj.storage.get_task(test_task.id)
    if retrieved_task:
        print(f"Retrieved task: {retrieved_task.title}")
    else:
        print("Could not retrieve task")


if __name__ == "__main__":
    debug_storage()