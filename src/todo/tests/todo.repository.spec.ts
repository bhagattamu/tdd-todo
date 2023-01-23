import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { connect, Connection, Model, Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Todo as TodoDocument, TodoSchema } from '../schema/todo.schema';
import { TodoRepository } from '../todo.repository';
import { todoStub } from '../stubs/todo.stub';
import { Todo } from '../todo.interface';

describe('TodoRepository', () => {
  let repository: TodoRepository;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let todoModel: Model<TodoDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    todoModel = mongoConnection.model(TodoDocument.name, TodoSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoRepository,
        {
          provide: getModelToken(TodoDocument.name),
          useValue: todoModel,
        },
      ],
    }).compile();

    repository = module.get<TodoRepository>(TodoRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('save', () => {
    let todo: Todo;
    it('should save todo', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todo = await repository.save(todoRequest);
      expect(todo.task).toEqual(todoRequest.task);
      expect(todo.priority).toEqual(todoRequest.priority);
      expect(todo.status).toEqual(todoRequest.status);
    });

    it('should throw required error when task empty', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoRequest.task = '';
      expect(repository.save(todoRequest)).rejects.toThrowError(
        'Please provide task',
      );
    });

    it('should throw required error when priority empty', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoRequest.priority = undefined;
      expect(repository.save(todoRequest)).rejects.toThrowError(
        'Please provide priority',
      );
    });

    it('should throw required error when status empty', async () => {
      const { id, createdAt: _, ...todoRequest } = todoStub();
      todoRequest.status = undefined;
      expect(repository.save(todoRequest)).rejects.toThrowError(
        'Please provide status',
      );
    });
  });

  describe('findTodo', () => {
    let todo: Todo;
    let todoList: Todo[];
    const { id, createdAt: _, ...todoRequest } = todoStub();

    beforeEach(async () => {
      todo = await repository.save(todoRequest);
      todoList = await repository.findTodo();
    });

    it('should return todoList', async () => {
      const [savedTodo] = todoList;
      expect(todoList.length).toEqual(1);
      expect(todo.id).toEqual(savedTodo.id);
      expect(todo.task).toEqual(savedTodo.task);
    });

    it('should return filter cancelled todo', async () => {
      const newTodo = await repository.save(todoRequest);
      await repository.updateTodoStatus(newTodo.id, 'cancelled');
      const todoList = await repository.findTodo({ withOutCancel: true });
      expect(todoList.length).toEqual(1);
      expect(todo.id).toEqual(todoList[0].id);
      expect(todo.task).toEqual(todoList[0].task);
    });
  });

  describe('findTodoById', () => {
    let todo: Todo;
    const { id, createdAt: _, ...todoRequest } = todoStub();

    beforeEach(async () => {
      todo = await repository.save(todoRequest);
    });

    it('should return todo', async () => {
      const foundTodo = await repository.findTodoById(todo.id);
      expect(foundTodo).toBeDefined();
      expect(foundTodo.id).toEqual(todo.id);
      expect(foundTodo.task).toEqual(todo.task);
    });

    it('should return undefined', async () => {
      const randomId = new Types.ObjectId().toString();
      const foundTodo = await repository.findTodoById(randomId);
      expect(foundTodo).toBeUndefined();
    });
  });

  describe('updateTodo', () => {});

  describe('updateTodoStatus', () => {
    let todo: Todo;
    const { id, createdAt: _, ...todoRequest } = todoStub();

    beforeEach(async () => {
      todo = await repository.save(todoRequest);
    });

    it('should change status to pending', async () => {
      await repository.updateTodoStatus(todo.id, 'pending');
      const updatedTodo = await repository.findTodoById(todo.id);
      expect(updatedTodo.status).toEqual('pending');
    });

    it('should change status to completed', async () => {
      await repository.updateTodoStatus(todo.id, 'completed');
      const updatedTodo = await repository.findTodoById(todo.id);
      expect(updatedTodo.status).toEqual('completed');
    });

    it('should change status to cancelled', async () => {
      await repository.updateTodoStatus(todo.id, 'cancelled');
      const updatedTodo = await repository.findTodoById(todo.id);
      expect(updatedTodo.status).toEqual('cancelled');
    });
  });
});
