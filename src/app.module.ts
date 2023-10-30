import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// models
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// middlewares
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SettingsModule,
  ],
  providers: [JwtService],
})
export class AppModule {
  configure(consumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
