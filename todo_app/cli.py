"""Command-line interface for the CLI Todo application."""
import click
from typing import Optional, List
from datetime import datetime
from .services import TaskService
from .storage import TaskStorage
from .models import TaskStatus, Priority
from .utils import (
    format_task_list,
    format_single_task,
    format_error_message,
    format_success_message,
    parse_date_string,
    get_status_text_with_color,
    get_priority_text_with_color
)


class CLIContext:
    """Shared context for CLI commands to maintain state."""

    def __init__(self):
        self.storage = TaskStorage()
        self.service = TaskService(self.storage)


@click.group()
@click.pass_context
def cli(ctx):
    """CLI Todo Application - Manage your tasks from the command line."""
    # Initialize the shared context
    ctx.ensure_object(CLIContext)


@cli.command()
@click.argument('title', nargs=1)
@click.option('--description', '-d', help='Task description')
@click.option('--priority', '-p', type=click.Choice(['low', 'medium', 'high']), default='medium', help='Task priority')
@click.option('--due-date', help='Task due date (YYYY-MM-DD or YYYY-MM-DD HH:MM)')
@click.pass_context
def add(ctx, title: str, description: Optional[str], priority: str, due_date: Optional[str]):
    """Add a new task."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Parse due date if provided
        parsed_due_date = None
        if due_date:
            parsed_due_date = parse_date_string(due_date)

        # Convert priority string to enum
        priority_enum = Priority[priority.upper()]

        # Add the task
        task = cli_ctx.service.add_task(
            title=title,
            description=description,
            priority=priority_enum,
            due_date=parsed_due_date
        )

        format_success_message(f"Task '{task.title}' added successfully with ID: {task.id[:8]}")
    except ValueError as e:
        format_error_message(str(e))
        raise click.Abort()
    except Exception as e:
        format_error_message(f"Failed to add task: {str(e)}")
        raise click.Abort()


@cli.command()
@click.option('--status', type=click.Choice(['pending', 'in-progress', 'completed']), help='Filter by status')
@click.option('--priority', type=click.Choice(['low', 'medium', 'high']), help='Filter by priority')
@click.option('--sort', type=click.Choice(['priority', 'due-date', 'created']), default='created', help='Sort by field')
@click.pass_context
def list(ctx, status: Optional[str], priority: Optional[str], sort: str):
    """List all tasks."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Convert filter strings to enums
        status_enum = None
        if status:
            status_enum = TaskStatus[status.upper().replace('-', '_')]

        priority_enum = None
        if priority:
            priority_enum = Priority[priority.upper()]

        # Get tasks
        tasks = cli_ctx.service.get_all_tasks(status=status_enum, priority=priority_enum)

        # Sort tasks
        if sort == 'priority':
            tasks.sort(key=lambda t: t.priority.value, reverse=True)
        elif sort == 'due-date':
            tasks.sort(key=lambda t: (t.due_date is None, t.due_date))
        else:  # sort by created date
            tasks.sort(key=lambda t: t.created_at, reverse=True)

        format_task_list(tasks)
    except Exception as e:
        format_error_message(f"Failed to list tasks: {str(e)}")
        raise click.Abort()


@cli.command()
@click.argument('task_id', nargs=1)
@click.pass_context
def show(ctx, task_id: str):
    """Show details of a specific task."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Get the task
        task = cli_ctx.service.get_task_by_id(task_id)
        if not task:
            format_error_message(f"Task with ID '{task_id}' not found")
            raise click.Abort()

        format_single_task(task)
    except Exception as e:
        format_error_message(f"Failed to show task: {str(e)}")
        raise click.Abort()


@cli.command()
@click.argument('task_id', nargs=1)
@click.option('--title', help='New task title')
@click.option('--description', '-d', help='New task description')
@click.option('--status', type=click.Choice(['pending', 'in-progress', 'completed']), help='New task status')
@click.option('--priority', '-p', type=click.Choice(['low', 'medium', 'high']), help='New task priority')
@click.option('--due-date', help='New task due date (YYYY-MM-DD or YYYY-MM-DD HH:MM)')
@click.pass_context
def update(ctx, task_id: str, title: Optional[str], description: Optional[str],
          status: Optional[str], priority: Optional[str], due_date: Optional[str]):
    """Update a task."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Convert status and priority strings to enums
        status_enum = None
        if status:
            status_enum = TaskStatus[status.upper().replace('-', '_')]

        priority_enum = None
        if priority:
            priority_enum = Priority[priority.upper()]

        # Parse due date if provided
        parsed_due_date = None
        if due_date:
            parsed_due_date = parse_date_string(due_date)

        # Update the task
        updated_task = cli_ctx.service.update_task(
            task_id=task_id,
            title=title,
            description=description,
            status=status_enum,
            priority=priority_enum,
            due_date=parsed_due_date
        )

        if not updated_task:
            format_error_message(f"Task with ID '{task_id}' not found")
            raise click.Abort()

        format_success_message(f"Task '{updated_task.title}' updated successfully")
    except ValueError as e:
        format_error_message(str(e))
        raise click.Abort()
    except Exception as e:
        format_error_message(f"Failed to update task: {str(e)}")
        raise click.Abort()


@cli.command()
@click.argument('task_id', nargs=1)
@click.pass_context
def complete(ctx, task_id: str):
    """Mark a task as completed."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Complete the task
        task = cli_ctx.service.complete_task(task_id)
        if not task:
            format_error_message(f"Task with ID '{task_id}' not found")
            raise click.Abort()

        format_success_message(f"Task '{task.title}' marked as completed")
    except Exception as e:
        format_error_message(f"Failed to complete task: {str(e)}")
        raise click.Abort()


@cli.command()
@click.argument('task_id', nargs=1)
@click.pass_context
def uncomplete(ctx, task_id: str):
    """Mark a task as incomplete."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Mark task as incomplete
        task = cli_ctx.service.uncomplete_task(task_id)
        if not task:
            format_error_message(f"Task with ID '{task_id}' not found")
            raise click.Abort()

        format_success_message(f"Task '{task.title}' marked as incomplete")
    except Exception as e:
        format_error_message(f"Failed to uncomplete task: {str(e)}")
        raise click.Abort()


@cli.command()
@click.argument('task_ids', nargs=-1)
@click.pass_context
def bulk_complete(ctx, task_ids: List[str]):
    """Mark multiple tasks as completed."""
    if not task_ids:
        format_error_message("Please provide at least one task ID")
        raise click.Abort()

    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Bulk complete tasks
        success_count, failure_count = cli_ctx.service.bulk_complete_tasks(list(task_ids))

        format_success_message(f"Completed {success_count} tasks, {failure_count} failures")
    except Exception as e:
        format_error_message(f"Failed to bulk complete tasks: {str(e)}")
        raise click.Abort()


@cli.command()
@click.argument('task_id', nargs=1)
@click.pass_context
def delete(ctx, task_id: str):
    """Delete a task."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Delete the task
        success = cli_ctx.service.delete_task(task_id)
        if not success:
            format_error_message(f"Task with ID '{task_id}' not found")
            raise click.Abort()

        format_success_message(f"Task with ID '{task_id[:8]}' deleted successfully")
    except Exception as e:
        format_error_message(f"Failed to delete task: {str(e)}")
        raise click.Abort()


@cli.command()
@click.pass_context
def delete_completed(ctx):
    """Delete all completed tasks."""
    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Delete completed tasks
        deleted_count = cli_ctx.service.delete_completed_tasks()

        format_success_message(f"Deleted {deleted_count} completed tasks")
    except Exception as e:
        format_error_message(f"Failed to delete completed tasks: {str(e)}")
        raise click.Abort()


@cli.command()
@click.pass_context
def delete_all(ctx):
    """Delete all tasks."""
    click.confirm('Are you sure you want to delete ALL tasks?', abort=True)

    try:
        # Get the shared context
        cli_ctx = ctx.obj

        # Delete all tasks
        success = cli_ctx.service.delete_all_tasks()

        if success:
            format_success_message("All tasks deleted successfully")
        else:
            format_error_message("Failed to delete all tasks")
            raise click.Abort()
    except Exception as e:
        format_error_message(f"Failed to delete all tasks: {str(e)}")
        raise click.Abort()


if __name__ == '__main__':
    cli()