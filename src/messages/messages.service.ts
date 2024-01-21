import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(message: Message): Promise<Message> {
    const createdMessage = new this.messageModel(message);

    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    const messages = await this.messageModel.find().exec();

    return messages.map((message) => ({
      ...message.toJSON(),
      from: JSON.parse(message.from),
    }));
  }
}
