import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

// services
import { EventsService } from './events.service';

// dtos
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventDto } from './dtos/event.dto';

// decorators
import { CurrentUser } from '../users/decorators/current-user.decorator';

// interceptors
import { Serialize } from '../interceptors/serialize.interceptor';

// entities
import { User } from '../users/user.entity';

// guards
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('events')
@Serialize(EventDto)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() data: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.create(data, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.eventsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
