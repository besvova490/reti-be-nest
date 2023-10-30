import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// models
import { UsersModule } from '../users/users.module';

// services
import { AuthService } from './auth.service';

// controllers
import { AuthController } from './auth.controller';

// strategies
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
