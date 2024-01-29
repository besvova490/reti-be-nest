import { PartialType } from '@nestjs/mapped-types';

// dtos
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
