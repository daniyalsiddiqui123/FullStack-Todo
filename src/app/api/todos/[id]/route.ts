import { NextRequest, NextResponse } from 'next/server';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/db/todo-service';

// Dynamic segment configuration
export const dynamic = 'force-dynamic';

// GET /api/todos/[id] - Get a specific todo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get the specific todo for the authenticated user
    const todo = await getTodoById(id, userId);

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todo not found or access denied'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: todo
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/todos/[id] - Update a specific todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate the input
    const validatedData = {
      title: body.title,
      description: body.description,
      completed: body.completed
    };

    // Update the todo
    const updatedTodo = await updateTodo(id, userId, validatedData);

    if (!updatedTodo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todo not found or access denied'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTodo
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a specific todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete the todo
    const deleted = await deleteTodo(id, userId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todo not found or access denied'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}