export type Priority = 'low' | 'medium' | 'high';

export type Status = 'pending' | 'completed' | 'cancelled';

export interface Todo {
  id: string;
  task: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
}

export interface TodoRequest {
  task: string;
  priority: Priority;
  status: Status;
}
