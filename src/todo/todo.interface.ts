export type Priority = 'low' | 'medium' | 'high';

export type Status = 'pending' | 'completed' | 'cancelled';

export interface Task {
  detail: string;
  priority: Priority;
}

export interface Todo {
  id: string;
  task: Task;
  status: Status;
  createdAt: Date;
}

export interface TodoRequest {
  task: Task;
  status: Status;
}
