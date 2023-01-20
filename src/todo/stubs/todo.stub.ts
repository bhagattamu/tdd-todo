import { Todo } from '../todo.interface';

export const todoStub = (): Todo => ({
  id: 'testid',
  task: 'Test Task',
  priority: 'high',
  status: 'pending',
  createdAt: new Date(),
});
