import { Types } from 'mongoose';
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
});
