import { Test, TestingModule } from '@nestjs/testing';
import { todoStub } from '../stubs/todo.stub';
import { TodoController } from '../todo.controller';
import { Todo } from '../todo.interface';
import { TodoService } from '../todo.service';

jest.mock('../todo.service');

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

  describe('add task', () => {
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

  describe('get tasks', () => {
    let todoList: Todo[];
    const { id, createdAt: _, ...todoRequest } = todoStub();

    beforeEach(async () => {
      await controller.add(todoRequest);
      todoList = await controller.getTodoList(false);
    });

    it('should call todoService', () => {
      expect(service.getTodoList).toBeCalled();
    });

    it('should return a list of todo', () => {
      expect(todoList.length).toEqual(1);
      if (todoList.length === 1) {
        const [todo] = todoList;
        expect(todo.id).toEqual(id);
        expect(todo.task).toEqual(todoRequest.task);
      }
    });
  });

  describe('getTaskById', () => {
    let todo: Todo;
    const { id, createdAt: _, ...todoRequest } = todoStub();
    beforeEach(async () => {
      todo = await controller.add(todoRequest);
    });

    it('should call todoService', async () => {
      await controller.getTodoById(todo.id);
      expect(service.getTodoById).toHaveBeenCalledWith(todo.id);
    });

    it('should return todo', async () => {
      const foundTodo = await controller.getTodoById(todo.id);
      expect(foundTodo.task).toEqual(todoRequest.task);
    });
  });

  describe('complete', () => {
    let todo: Todo;
    const { id, createdAt: _, ...todoRequest } = todoStub();
    beforeEach(async () => {
      todo = await controller.add(todoRequest);
      await controller.complete(todo.id);
    });

    it('should call todoService.complete method', () => {
      expect(service.complete).toBeCalledWith(todo.id);
    });
  });

  describe('cancel', () => {
    let todo: Todo;
    const { id, createdAt: _, ...todoRequest } = todoStub();
    beforeEach(async () => {
      todo = await controller.add(todoRequest);
      await controller.cancel(todo.id);
    });

    it('should call todoService.cancel method', () => {
      expect(service.cancel).toBeCalledWith(todo.id);
    });
  });
});
