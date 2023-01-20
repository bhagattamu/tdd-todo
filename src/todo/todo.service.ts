import { BadRequestException, Injectable } from '@nestjs/common';
import { Todo, TodoRequest } from './todo.interface';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  /**
   * Function to add todo
   * @param {TodoRequest} todoRequest Todo request data
   * @returns {Todo} Created Todo data
   */
  async add(todoRequest: TodoRequest): Promise<Todo> {
    if (!todoRequest.task) {
      throw new BadRequestException('Please provide task');
    }
    if (!todoRequest.priority) {
      throw new BadRequestException('Please provide priority');
    }
    if (!todoRequest.status) {
      throw new BadRequestException('Please provide status');
    }
    const createdTodo = await this.todoRepository.save(todoRequest);

    return {
      id: createdTodo._id.toString(),
      task: createdTodo.task,
      priority: createdTodo.priority,
      status: createdTodo.status,
      createdAt: createdTodo.createdAt,
    };
  }
}
