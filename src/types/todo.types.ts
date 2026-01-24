export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface TodoResponse {
  success: boolean;
  data?: Todo | Todo[];
  message?: string;
  error?: string;
}