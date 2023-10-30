import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// dtos
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';
import { UserDto } from '../users/dtos/user.dto';

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

  @Post('/refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}
