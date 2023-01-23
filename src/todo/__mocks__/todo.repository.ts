import { Types } from 'mongoose';
import { todoStub } from '../stubs/todo.stub';
import { Status, TodoRequest } from '../todo.interface';

const todoId = new Types.ObjectId().toString();
let todoStatus: Status = 'pending';

export const TodoRepository = jest.fn().mockReturnValue({
  save: jest.fn().mockImplementation((todoRequest: TodoRequest) => {
    if (!todoRequest.task) {
      throw new Error('Please provide task');
    }
    if (!todoRequest.priority) {
      throw new Error('Please provide priority');
    }
    if (!todoRequest.status) {
      throw new Error('Please provide status');
    }
    todoStatus = 'pending';

    return {
      id: todoId,
      ...todoRequest,
      createdAt: new Date(),
    };
  }),
  findTodo: jest.fn().mockImplementation(() => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    return [
      {
        id: todoId,
        ...todoRequest,
        status: todoStatus,
        createdAt: new Date(),
      },
    ];
  }),
  findTodoById: jest.fn().mockImplementation((todoId: string) => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    return {
      id: todoId,
      ...todoRequest,
      status: todoStatus,
      createdAt: new Date(),
    };
  }),
  updateTodoStatus: jest
    .fn()
    .mockImplementation((todoId: string, status: Status) => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoStatus = status;
      return {
        id: todoId,
        ...todoRequest,
        status: todoStatus,
        createdAt: new Date(),
      };
    }),
});
