import { NextRequest, NextResponse } from 'next/server';
import { getUserTodos, createTodo } from '@/lib/db/todo-service';

export async function GET(request: NextRequest) {
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

    // Get todos for the authenticated user
    const todos = await getUserTodos(userId);

    return NextResponse.json({
      success: true,
      data: todos
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

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate the input
    const validatedData = {
      title: body.title,
      description: body.description,
      completed: body.completed || false
    };

    // Create the todo
    const todo = await createTodo(
      userId,
      validatedData.title,
      validatedData.description,
      validatedData.completed
    );

    return NextResponse.json({
      success: true,
      data: todo
    }, { status: 201 });
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