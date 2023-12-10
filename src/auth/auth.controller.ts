import { Controller, Post, Get, Body, Delete, UseGuards } from '@nestjs/common';

// services
import { AuthService } from './auth.service';

// decorators
import { CurrentUser } from '../users/decorators/current-user.decorator';

// dtos
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';
import { TwoFactorDto } from './dtos/two-factor.dto';
import { UserDto } from '../users/dtos/user.dto';

// entities
import { User } from '../users/user.entity';

// guards
import { AuthGuard } from './guards/auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

// interceptors
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Serialize(UserDto)
  create(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body() body: AuthDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('/two-factor')
  async twoFactor(@CurrentUser() user: User) {
    return this.authService.twoFactor(user);
  }

  @UseGuards(AuthGuard)
  @Post('/two-factor')
  async twoFactorConfirm(
    @CurrentUser() user: User,
    @Body('twoFactorCode') twoFactorCode: string,
  ) {
    return this.authService.twoFactorConfirm(user, twoFactorCode);
  }

  @UseGuards(AuthGuard)
  @Delete('/two-factor')
  async twoFactorRemove(@CurrentUser() user: User) {
    return this.authService.twoFactorRemove(user);
  }

  @Post('/two-factor-verifier')
  async twoFactorVerifier(@Body('twoFactorCode') body: TwoFactorDto) {
    return this.authService.twoFactorVerifier(body.email, body.twoFactorCode);
  }
}
