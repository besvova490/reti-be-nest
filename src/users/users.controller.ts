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
import { SettingsDto } from '../settings/dtos/settings.dto';
import { UpdateSettingsDto } from '../settings/dtos/update-settings.dto';
import { SubscriptionDto } from '../subscriptions/dtos/subscription.dto';

// interceptors
import { Serialize } from '../interceptors/serialize.interceptor';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
  ) {}

  @Serialize(UserDto)
  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Serialize(SettingsDto)
  @Get('/me/settings')
  getMySettings(@CurrentUser() user: User) {
    return this.usersService.findUserSettings(user.id);
  }

  @Serialize(SubscriptionDto)
  @Get('/me/subscription')
  getMySubscription(@CurrentUser() user: User) {
    return this.usersService.findUserSubscription(user.id);
  }

  @Serialize(SettingsDto)
  @Patch('/me/settings')
  async updateSettings(
    @CurrentUser() user: User,
    @Body() body: UpdateSettingsDto,
  ) {
    const settings = await this.usersService.findUserSettings(user.id);

    return this.settingsService.update(settings.id, body);
  }

  @Serialize(UserDto)
  @Patch('/me')
  updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    return this.usersService.update(user.id, body);
  }

  @Delete('/me')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Serialize(UserDto)
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Serialize(UserDto)
  @Get('/')
  getUsers(@Query('email') email: string) {
    return this.usersService.findAll({ email });
  }
}
