"""Utility functions for the CLI Todo application."""
from typing import List
from datetime import datetime
from rich.table import Table
from rich.console import Console
from .models import Task, TaskStatus, Priority


def format_task_list(tasks: List[Task]) -> str:
    """Format a list of tasks for display."""
    if not tasks:
        return "No tasks found."

    console = Console()
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("ID", style="dim", width=8)
    table.add_column("Title", min_width=15)
    table.add_column("Status", justify="center")
    table.add_column("Priority", justify="center")
    table.add_column("Due Date", justify="center")
    table.add_column("Created", justify="center")

    for task in tasks:
        status_text = get_status_text_with_color(task.status)
        priority_text = get_priority_text_with_color(task.priority)

        due_date_text = task.due_date.strftime("%Y-%m-%d") if task.due_date else "None"
        created_text = task.created_at.strftime("%Y-%m-%d %H:%M")

        table.add_row(
            task.id[:8],  # Shorten ID for display
            task.title,
            status_text,
            priority_text,
            due_date_text,
            created_text
        )

    console.print(table)
    return ""


def format_single_task(task: Task) -> str:
    """Format a single task for detailed display."""
    console = Console()

    console.print(f"[bold blue]Task Details[/bold blue]")
    console.print(f"[bold]ID:[/bold] {task.id}")
    console.print(f"[bold]Title:[/bold] {task.title}")

    if task.description:
        console.print(f"[bold]Description:[/bold] {task.description}")

    console.print(f"[bold]Status:[/bold] {get_status_text_with_color(task.status)}")
    console.print(f"[bold]Priority:[/bold] {get_priority_text_with_color(task.priority)}")

    if task.due_date:
        console.print(f"[bold]Due Date:[/bold] {task.due_date.strftime('%Y-%m-%d %H:%M')}")

    console.print(f"[bold]Created:[/bold] {task.created_at.strftime('%Y-%m-%d %H:%M')}")
    console.print(f"[bold]Updated:[/bold] {task.updated_at.strftime('%Y-%m-%d %H:%M')}")

    if task.completed_at:
        console.print(f"[bold]Completed:[/bold] {task.completed_at.strftime('%Y-%m-%d %H:%M')}")


def get_status_text_with_color(status: TaskStatus) -> str:
    """Get status text with appropriate color coding."""
    if status == TaskStatus.PENDING:
        return "[yellow]Pending[/yellow]"
    elif status == TaskStatus.IN_PROGRESS:
        return "[blue]In Progress[/blue]"
    elif status == TaskStatus.COMPLETED:
        return "[green]Completed[/green]"
    return str(status.value)


def get_priority_text_with_color(priority: Priority) -> str:
    """Get priority text with appropriate color coding."""
    if priority == Priority.HIGH:
        return "[red]High[/red]"
    elif priority == Priority.MEDIUM:
        return "[yellow]Medium[/yellow]"
    elif priority == Priority.LOW:
        return "[green]Low[/green]"
    return str(priority.value)


def format_error_message(message: str, error_code: int = 1) -> str:
    """Format an error message for display."""
    console = Console()
    console.print(f"[bold red]Error:[/bold red] {message}")
    return message


def format_success_message(message: str) -> str:
    """Format a success message for display."""
    console = Console()
    console.print(f"[bold green]Success:[/bold green] {message}")
    return message


def parse_date_string(date_str: str) -> datetime:
    """Parse a date string into a datetime object."""
    try:
        # Try common date formats
        for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M", "%m/%d/%Y", "%m/%d/%Y %H:%M"):
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        raise ValueError(f"Unable to parse date: {date_str}")
    except ValueError as e:
        raise ValueError(f"Invalid date format: {date_str}. Use YYYY-MM-DD or YYYY-MM-DD HH:MM") from e