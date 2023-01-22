import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  async getTodoById(@Param('id') id: string): Promise<Todo> {
    const todo = await this.todoService.getTodoById(id);
    return todo;
  }
}
