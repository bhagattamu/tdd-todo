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
    if (todoRequest.priority) {
      const correctPriority =
        todoRequest.priority === 'low' ||
        todoRequest.priority === 'medium' ||
        todoRequest.priority === 'high';
      if (!correctPriority) {
        throw new BadRequestException('Please provide correct priority');
      }
    } else {
      throw new BadRequestException('Please provide priority');
    }
    if (todoRequest.status) {
      const correctStatus =
        todoRequest.status === 'cancelled' ||
        todoRequest.status === 'completed' ||
        todoRequest.status === 'pending';
      if (!correctStatus) {
        throw new BadRequestException('Please provide correct status');
      }
    } else {
      throw new BadRequestException('Please provide status');
    }
    return await this.todoRepository.save(todoRequest);
  }

  /**
   * Function to get todo list
   * @returns {Todo[]} Todo list
   */
  async getTodoList(): Promise<Todo[]> {
    const todoList = await this.todoRepository.findTodo();
    return todoList;
  }

  async getTodoById(id: string): Promise<any> {
    const todo = await this.todoRepository.findTodoById(id);
    return todo;
  }
}
