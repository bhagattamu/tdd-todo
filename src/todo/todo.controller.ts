import { Body, Controller, Post } from '@nestjs/common';
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
}
