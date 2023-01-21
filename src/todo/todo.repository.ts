import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo as TodoDocument } from './schema/todo.schema';
import { Todo } from './todo.interface';

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
   * @returns {Todo[]} Todo list
   */
  async findTodo(): Promise<Todo[]> {
    const todoDocuments = await this.TodoModel.find();
    return todoDocuments.map((todo) => ({
      id: todo._id.toString(),
      task: todo.task,
      priority: todo.priority,
      status: todo.status,
      createdAt: todo.createdAt,
    }));
  }
}
