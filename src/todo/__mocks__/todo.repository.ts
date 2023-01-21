import { Types } from 'mongoose';
import { todoStub } from '../stubs/todo.stub';
import { TodoRequest } from '../todo.interface';

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

    return {
      _id: new Types.ObjectId(),
      ...todoRequest,
      createdAt: new Date(),
    };
  }),
  findTodo: jest.fn().mockImplementation(() => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    return [
      {
        _id: new Types.ObjectId(),
        ...todoRequest,
        createdAt: new Date(),
      },
    ];
  }),
});
