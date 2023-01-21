import { Body, Controller, Get, Post } from '@nestjs/common';
import { Todo, TodoRequest } from './todo.interface';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async add(@Body() todoRequest: TodoRequest): Promise<Todo> {
    const todo = await this.todoService.add(todoRequest);
    return todo;
  }

  @Get()
  async getTodoList(): Promise<Todo[]> {
    const todoList = await this.todoService.getTodoList();
    return todoList;
  }
}
