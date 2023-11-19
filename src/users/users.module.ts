import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

// models
import { SettingsModule } from '../settings/settings.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

// controllers
import { UsersController } from './users.controller';

// services
import { UsersService } from './users.service';

// entities
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SettingsModule,
    SubscriptionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, SettingsModule, SubscriptionsModule],
  exports: [UsersService],
})
export class UsersModule {}
