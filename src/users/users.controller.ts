import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';

// services
import { UsersService } from './users.service';
import { SettingsService } from '../settings/settings.service';

// decorators
import { CurrentUser } from './decorators/current-user.decorator';

// guards
import { AuthGuard } from '../auth/guards/auth.guard';

// entities
import { User } from './user.entity';

// dtos
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

// interceptors
import { Serialize } from '../interceptors/serialize.interceptor';

@UseGuards(AuthGuard)
@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
  ) {}

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get('/me/settings')
  setMySettings(@CurrentUser() user: User) {
    return this.usersService.findUserSettings(user.id);
  }

  @Patch('/me')
  updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    return this.usersService.update(user.id, body);
  }

  @Delete('/me')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Get('/')
  getUsers(@Query('email') email: string) {
    return this.usersService.findAll({ email });
  }
}
