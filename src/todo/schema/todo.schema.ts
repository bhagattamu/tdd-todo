import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Priority, Status } from '../todo.interface';

@Schema({ timestamps: false, versionKey: false })
class Task {
  @Prop({
    type: SchemaTypes.String,
    required: [true, 'Please provide task detail'],
  })
  detail: string;

  @Prop({
    type: SchemaTypes.String,
    required: [true, 'Please provide task priority'],
  })
  priority: Priority;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

@Schema({ timestamps: true })
export class Todo {
  _id: Types.ObjectId;

  @Prop({
    type: TaskSchema,
    required: [true, 'Please provide task'],
  })
  task: Task;

  @Prop({
    type: SchemaTypes.String,
    required: [true, 'Please provide status'],
    default: 'pending',
    validate: {
      validator: (value: Status) => {
        const validValues: Status[] = ['pending', 'cancelled', 'completed'];
        return Promise.resolve(validValues.includes(value));
      },
      message: 'Please provide valid status',
    },
  })
  status: Status;

  createdAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
