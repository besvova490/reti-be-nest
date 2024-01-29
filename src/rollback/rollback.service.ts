import { Model } from 'mongoose';
import { DeleteResult } from 'typeorm/driver/mongodb/typings';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// schemas
import { Rollback } from './schemas/rollback.schema';

@Injectable()
export class RollbackService {
  constructor(
    @InjectModel(Rollback.name) private rollbackModel: Model<Rollback>,
  ) {}

  async create(data: Rollback) {
    const createdMessage = new this.rollbackModel(data);

    return createdMessage.save();
  }

  async findAll() {
    const rollbacks = await this.rollbackModel.find().exec();

    return rollbacks;
  }

  async findOne(id: string) {
    const rollback = await this.rollbackModel.findById(id).exec();

    return rollback;
  }

  async delete(id: string) {
    const rollback: DeleteResult = await this.rollbackModel
      .deleteOne({ _id: id })
      .exec();

    return rollback;
  }
}
