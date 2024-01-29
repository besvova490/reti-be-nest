import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Rollback {
  @Prop({ required: false, default: new Date() })
  createdAt?: Date;

  @Prop({ required: true })
  query: string;

  @Prop({ required: false })
  table: string;

  @Prop({ required: false, unique: false })
  recordId: number;
}

export type RollbackDocument = HydratedDocument<Rollback>;
export const RollbackSchema = SchemaFactory.createForClass(Rollback);
