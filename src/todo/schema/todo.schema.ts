import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Priority, Status } from '../todo.interface';

@Schema({ timestamps: true })
export class Todo {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.String,
    required: [true, 'Please provide task'],
  })
  task: string;

  @Prop({
    type: SchemaTypes.String,
    required: [true, 'Please provide priority'],
  })
  priority: Priority;

  @Prop({
    type: SchemaTypes.String,
    required: [true, 'Please provide status'],
  })
  status: Status;

  createdAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);