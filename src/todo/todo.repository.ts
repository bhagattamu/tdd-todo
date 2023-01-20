import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schema/todo.schema';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel(Todo.name) private readonly TodoModel: Model<Todo>,
  ) {}

  /**
   * Function to save todo in mongo
   * @param {Omit<Todo, '_id' | 'createdAt'>} todo Todo data to be saved
   * @returns {Todo} Todo mongo document
   */
  async save(todo: Omit<Todo, '_id' | 'createdAt'>): Promise<Todo> {
    return new this.TodoModel(todo).save();
  }
}
