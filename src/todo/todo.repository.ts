import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo as TodoDocument } from './schema/todo.schema';
import { Status, Todo } from './todo.interface';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel(TodoDocument.name)
    private readonly TodoModel: Model<TodoDocument>,
  ) {}

  /**
   * Function to save todo in mongo
   * @param {Omit<TodoDocument, '_id' | 'createdAt'>} todo Todo data to be saved
   * @returns {Todo} Created Todo
   */
  async save(todo: Omit<TodoDocument, '_id' | 'createdAt'>): Promise<Todo> {
    const savedTodo = await new this.TodoModel(todo).save();
    return {
      id: savedTodo._id.toString(),
      task: savedTodo.task,
      priority: savedTodo.priority,
      status: savedTodo.status,
      createdAt: savedTodo.createdAt,
    };
  }

  /**
   * Function to get todo list form mongo database
   * @param {{withOutCancel: boolean}} options Option to hide cancelled todo
   * @returns {Todo[]} Todo list
   */
  async findTodo(options?: { withOutCancel: boolean }): Promise<Todo[]> {
    const todoDocuments = await this.TodoModel.find({
      ...(options?.withOutCancel ? { status: { $ne: 'cancelled' } } : {}),
    }).sort({ createdAt: -1 });
    return todoDocuments.map((todo) => ({
      id: todo._id.toString(),
      task: todo.task,
      priority: todo.priority,
      status: todo.status,
      createdAt: todo.createdAt,
    }));
  }

  /**
   * Function to find todo by id
   * @param {string} id Todo Id
   * @returns {Todo} Todo
   */
  async findTodoById(id: string): Promise<Todo> {
    const todo = await this.TodoModel.findById(id);
    if (todo) {
      return {
        id: todo._id.toString(),
        task: todo.task,
        priority: todo.priority,
        status: todo.status,
        createdAt: todo.createdAt,
      };
    }
    return undefined;
  }

  /**
   * Function to change todo status
   * @param {string} id Todo Id
   * @param {Status} status Todo status
   */
  async updateTodoStatus(id: string, status: Status): Promise<void> {
    await this.TodoModel.findByIdAndUpdate(id, {
      $set: {
        status,
      },
    });
  }
}
