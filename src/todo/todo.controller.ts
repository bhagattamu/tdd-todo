import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Put, Query } from '@nestjs/common/decorators';
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
  async getTodoList(
    @Query('withOutCancel') withOutCancel: boolean,
  ): Promise<Todo[]> {
    const todoList = await this.todoService.getTodoList({ withOutCancel });
    return todoList;
  }

  @Get(':id')
  async getTodoById(@Param('id') id: string): Promise<Todo> {
    const todo = await this.todoService.getTodoById(id);
    return todo;
  }

  @Put(':id/complete')
  async complete(@Param('id') id: string): Promise<void> {
    await this.todoService.complete(id);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string): Promise<void> {
    await this.todoService.cancel(id);
  }
}
