import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

// modules
import { UsersModule } from 'src/users/users.module';

// services
import { EventsService } from './events.service';

// controllers
import { EventsController } from './events.controller';

// entities
import { Event } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule],
  controllers: [EventsController],
  providers: [EventsService, UsersModule, JwtService],
})
export class EventsModule {}
