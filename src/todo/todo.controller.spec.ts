import { Test, TestingModule } from '@nestjs/testing';
import { todoStub } from './stubs/todo.stub';
import { TodoController } from './todo.controller';
import { Todo } from './todo.interface';
import { TodoService } from './todo.service';
jest.mock('./todo.service');

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    let todo: Todo;

    beforeEach(async () => {
      todo = await controller.add(todoRequest);
    });

    it('should call todoService', () => {
      expect(service.add).toHaveBeenCalledWith(todoRequest);
    });

    it('should return todo', () => {
      expect(todo.id).toEqual(id);
      expect(todo.task).toEqual(todoRequest.task);
    });
  });
});
