import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Message {
  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true, default: null })
  content: string;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: true })
  from: string;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
