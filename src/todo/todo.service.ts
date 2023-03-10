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
    if (todoRequest.task.priority) {
      const correctPriority =
        todoRequest.task.priority === 'low' ||
        todoRequest.task.priority === 'medium' ||
        todoRequest.task.priority === 'high';
      if (!correctPriority) {
        throw new BadRequestException('Please provide correct priority');
      }
    } else {
      throw new BadRequestException('Please provide task priority');
    }
    return await this.todoRepository.save(todoRequest);
  }

  /**
   * Function to get todo list
   * @returns {Todo[]} Todo list
   */
  async getTodoList(options?: { withOutCancel: boolean }): Promise<Todo[]> {
    const todoList = await this.todoRepository.findTodo(options);
    return todoList;
  }

  /**
   * Function to get todo by id
   * @param {string} id Todo Id
   * @returns {Todo} Todo
   */
  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findTodoById(id);
    return todo;
  }

  /**
   * Function to complete todo
   * @param {string} id Todo Id
   */
  async complete(id: string): Promise<void> {
    await this.todoRepository.updateTodoStatus(id, 'completed');
  }

  /**
   * Function to cancel todo
   * @param {string} id Todo Id
   */
  async cancel(id: string): Promise<void> {
    await this.todoRepository.updateTodoStatus(id, 'cancelled');
  }
}
