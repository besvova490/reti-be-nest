import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

// services
import { RollbackService } from './rollback.service';

// controllers
import { RollbackController } from './rollback.controller';

// schemas
import { Rollback, RollbackSchema } from './schemas/rollback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rollback.name, schema: RollbackSchema },
    ]),
  ],
  providers: [RollbackService, JwtService],
  controllers: [RollbackController],
  exports: [RollbackService],
})
export class RollbackModule {}
