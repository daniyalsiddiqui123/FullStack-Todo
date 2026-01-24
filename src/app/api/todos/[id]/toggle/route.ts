import { NextRequest, NextResponse } from 'next/server';
import { toggleTodoCompletion } from '@/lib/db/todo-service';

// Dynamic segment configuration
export const dynamic = 'force-dynamic';

// PATCH /api/todos/[id]/toggle - Toggle a todo's completion status
export async function PATCH(
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

    // Toggle the todo completion status
    const updatedTodo = await toggleTodoCompletion(id, userId);

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