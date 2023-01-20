import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { todoStub } from './stubs/todo.stub';
import { Todo } from './todo.interface';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

jest.mock('./todo.repository');

describe('TodoService', () => {
  let service: TodoService;
  let repository: TodoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, TodoRepository],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<TodoRepository>(TodoRepository);
    jest.clearAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    describe('Add success', () => {
      let todo: Todo;
      const { id, createdAt: _, ...todoRequest } = todoStub();

      beforeEach(async () => {
        todo = await service.add(todoRequest);
      });

      it('should call todoRepository save method', async () => {
        expect(repository.save).toBeCalledWith(todoRequest);
      });

      it('should return new todo', () => {
        expect(todo.task).toEqual(todoRequest.task);
      });
    });

    it('throw bad request error when task or priority or status is empty', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoRequest.task = undefined;
      await expect(service.add(todoRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throw bad request error when priority is empty', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoRequest.priority = undefined;
      await expect(service.add(todoRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throw bad request error when priority is not low | medium | high', async () => {
      const todoRequest: any = {
        task: 'test',
        priority: 'asdasd',
        status: 'pending',
      };

      expect(service.add(todoRequest)).rejects.toThrow(BadRequestException);
    });

    it('throw bad request error when status is empty', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoRequest.status = undefined;
      await expect(service.add(todoRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throw bad request error when status is not pending | completed | cancelled', async () => {
      const todoRequest: any = {
        task: 'test',
        priority: 'high',
        status: 'test',
      };

      expect(service.add(todoRequest)).rejects.toThrow(BadRequestException);
    });
  });
});
