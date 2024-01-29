import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

// models
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';

// middlewares
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { SettingsModule } from './settings/settings.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';
import { RollbackModule } from './rollback/rollback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MEST_MONGO_URL),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SettingsModule,
    SubscriptionsModule,
    EventsModule,
    SocketModule,
    MessagesModule,
    RollbackModule,
  ],
  providers: [JwtService],
})
export class AppModule {
  configure(consumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
