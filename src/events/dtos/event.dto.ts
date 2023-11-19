import { Expose, Transform } from 'class-transformer';

// helpers
import { EventStatus } from '../event.entity';

export class EventDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly date: string;

  @Expose()
  readonly room: string;

  @Expose()
  readonly status: EventStatus;

  @Expose()
  @Transform(({ obj }) =>
    obj.guests.map((guest) => ({
      id: guest.id,
      email: guest.email,
      firstName: guest.firstName,
      lastName: guest.lastName,
    })),
  )
  readonly guests: string[];

  @Expose()
  readonly isFavorite: boolean;
}
