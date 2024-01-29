import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';

// modules
import { UsersModule } from 'src/users/users.module';
import { RollbackModule } from 'src/rollback/rollback.module';

// services
import { EventsService } from './events.service';
import { RollbackService } from 'src/rollback/rollback.service';

// subscribers
import { EventsSubscriber } from './events.subscriber';

// controllers
import { EventsController } from './events.controller';

// entities
import { Event } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule, RollbackModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    UsersModule,
    JwtService,
    EventsSubscriber,
    RollbackModule,
  ],
})
export class EventsModule {
  constructor(
    private connection: Connection,
    private rollbackService: RollbackService,
  ) {
    this.connection.subscribers.push(new EventsSubscriber(rollbackService));
  }
}
