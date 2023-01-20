import { todoStub } from '../stubs/todo.stub';

export const TodoService = jest.fn().mockReturnValue({
  add: jest.fn().mockResolvedValue(todoStub()),
});
