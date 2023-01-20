import { Test, TestingModule } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Todo, TodoSchema } from './schema/todo.schema';
import { TodoRepository } from './todo.repository';
import { getModelToken } from '@nestjs/mongoose';
import { todoStub } from './stubs/todo.stub';
import { ConflictException } from '@nestjs/common';

describe('TodoRepository', () => {
  let repository: TodoRepository;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let todoModel: Model<Todo>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    todoModel = mongoConnection.model(Todo.name, TodoSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoRepository,
        {
          provide: getModelToken(Todo.name),
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
});
