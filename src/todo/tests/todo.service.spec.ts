import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { todoStub } from '../stubs/todo.stub';
import { Todo } from '../todo.interface';
import { TodoRepository } from '../todo.repository';
import { TodoService } from '../todo.service';

jest.mock('../todo.repository');

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

  describe('getTodoList', () => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    let todo: Todo;
    let todoList: Todo[];

    beforeEach(async () => {
      todo = await service.add(todoRequest);
      todoList = await service.getTodoList();
    });

    it('should call respository service', () => {
      expect(repository.findTodo).toBeCalled();
    });

    it('should return todoList', () => {
      const [savedTodo] = todoList;
      expect(todoList.length).toEqual(1);
      expect(todo.id).toEqual(savedTodo.id);
      expect(todo.task).toEqual(savedTodo.task);
    });

    it('should return todoList without cancelled status', async () => {
      const newTodo = await service.add(todoRequest);
      await service.cancel(newTodo.id);
      const todoList = await service.getTodoList();
      const [savedTodo] = todoList;
      expect(todoList.length).toEqual(1);
      expect(todo.id).toEqual(savedTodo.id);
      expect(todo.task).toEqual(savedTodo.task);
    });
  });

  describe('getTodoById', () => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    let todo: Todo;

    beforeEach(async () => {
      todo = await service.add(todoRequest);
      await service.getTodoById(todo.id);
    });

    it('should call todo repository', () => {
      expect(repository.findTodoById).toHaveBeenCalledWith(todo.id);
    });

    it('should find todo', async () => {
      const foundTodo = await service.getTodoById(todo.id);
      expect(foundTodo.id).toEqual(todo.id);
      expect(foundTodo.task).toEqual(todo.task);
    });
  });

  describe('complete', () => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    let todo: Todo;

    beforeEach(async () => {
      todo = await service.add(todoRequest);
      await service.complete(todo.id);
    });

    it('should call repository', () => {
      expect(repository.updateTodoStatus).toBeCalled();
    });

    it('should change status to completed', async () => {
      const completedTodo = await repository.findTodoById(todo.id);
      expect(completedTodo.status).toEqual('completed');
    });
  });

  describe('cancel', () => {
    const { id, createdAt: _, ...todoRequest } = todoStub();
    let todo: Todo;

    beforeEach(async () => {
      todo = await service.add(todoRequest);
      await service.cancel(todo.id);
    });

    it('should call repository', () => {
      expect(repository.updateTodoStatus).toBeCalled();
    });

    it('should change status to cancelled', async () => {
      const cancelledTodo = await repository.findTodoById(todo.id);
      expect(cancelledTodo.status).toEqual('cancelled');
    });
  });
});
